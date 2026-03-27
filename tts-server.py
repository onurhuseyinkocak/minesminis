"""
MinesMinis Local TTS Server
Uses Qwen3-TTS-12Hz-1.7B-VoiceDesign to generate audio locally.
Uploads to Supabase Storage and caches in tts_cache table.
Run with: ~/qwen-tts-env/bin/python tts-server.py
"""

from contextlib import asynccontextmanager
from typing import Optional
import hashlib
import io
import os

import requests
import torch
import soundfile as sf
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel

# ─── Config ──────────────────────────────────────────────────────────────────

MODEL_ID = "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign"

SUPABASE_URL = "https://sblwqplagirgiroekotp.supabase.co"
SERVICE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNibHdxcGxhZ2lyZ2lyb2Vrb3RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIs"
    "ImlhdCI6MTc2MTUzNzY3NiwiZXhwIjoyMDc3MTEzNjc2fQ."
    "spZC8YAQ7K42eCpkl17kwQdrfeqVeEC9EgAlpl629v8"
)

DEFAULT_INSTRUCTION = (
    "Speak in a clear, natural American English accent. "
    "Friendly and warm tone suitable for children aged 4-8."
)

tts_model = None


# ─── Lifespan ─────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    global tts_model
    print("Loading Qwen3 TTS model...")
    from qwen_tts import Qwen3TTSModel
    tts_model = Qwen3TTSModel.from_pretrained(
        MODEL_ID,
        device_map="cpu",
        dtype=torch.float32,
        attn_implementation=None,
    )
    print("Model loaded successfully.")
    yield
    print("Shutting down TTS server.")


app = FastAPI(title="MinesMinis TTS Server", lifespan=lifespan)


# ─── Request / Response models ────────────────────────────────────────────────

class GenerateRequest(BaseModel):
    text: str
    instruction: Optional[str] = None


class GenerateAndUploadRequest(BaseModel):
    text: str
    key: str  # e.g. "phonics/s.wav"
    instruction: Optional[str] = None


class UploadResponse(BaseModel):
    url: str
    cached: bool


# ─── Helpers ──────────────────────────────────────────────────────────────────

def numpy_to_wav_bytes(wav_array, sample_rate: int) -> bytes:
    buf = io.BytesIO()
    sf.write(buf, wav_array, sample_rate, format="WAV", subtype="PCM_16")
    buf.seek(0)
    return buf.read()


def text_md5(text: str) -> str:
    return hashlib.md5(text.lower().strip().encode()).hexdigest()


def upload_to_supabase(audio_bytes: bytes, storage_key: str) -> str:
    url = f"{SUPABASE_URL}/storage/v1/object/audio/{storage_key}"
    resp = requests.put(
        url,
        data=audio_bytes,
        headers={
            "Authorization": f"Bearer {SERVICE_KEY}",
            "Content-Type": "audio/wav",
            "x-upsert": "true",
        },
        timeout=30,
    )
    if resp.status_code not in (200, 201):
        raise RuntimeError(
            f"Supabase upload failed: {resp.status_code} {resp.text[:200]}"
        )
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/audio/{storage_key}"
    return public_url


def save_to_tts_cache(text: str, url: str) -> None:
    t_hash = text_md5(text)
    resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/tts_cache",
        json={"text_hash": t_hash, "text": text, "audio_url": url},
        headers={
            "Authorization": f"Bearer {SERVICE_KEY}",
            "apikey": SERVICE_KEY,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
        timeout=15,
    )
    if resp.status_code not in (200, 201):
        print(f"[CACHE SAVE ERROR] {resp.status_code}: {resp.text}")


def check_tts_cache(text: str) -> Optional[str]:
    t_hash = text_md5(text)
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/tts_cache",
        params={"text_hash": f"eq.{t_hash}", "select": "audio_url", "limit": "1"},
        headers={
            "Authorization": f"Bearer {SERVICE_KEY}",
            "apikey": SERVICE_KEY,
        },
        timeout=10,
    )
    if resp.status_code == 200:
        rows = resp.json()
        if rows:
            return rows[0]["audio_url"]
    return None


def generate_audio(text: str, instruction: Optional[str] = None):
    if tts_model is None:
        raise RuntimeError("TTS model not loaded")
    instr = instruction or DEFAULT_INSTRUCTION
    wavs, sample_rate = tts_model.generate_voice_design(text, language="english", instruct=instr)
    # wavs is a list of numpy arrays; take the first one
    wav_array = wavs[0] if isinstance(wavs, (list, tuple)) else wavs
    return wav_array, sample_rate


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"ok": True, "model": "Qwen3-TTS-12Hz-1.7B-VoiceDesign"}


@app.post("/generate")
async def generate(req: GenerateRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="text is required")
    try:
        wav_array, sample_rate = generate_audio(req.text, req.instruction)
        audio_bytes = numpy_to_wav_bytes(wav_array, sample_rate)
        return Response(content=audio_bytes, media_type="audio/wav")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/generate-and-upload", response_model=UploadResponse)
async def generate_and_upload(req: GenerateAndUploadRequest):
    if not req.text.strip():
        raise HTTPException(status_code=400, detail="text is required")
    if not req.key.strip():
        raise HTTPException(status_code=400, detail="key is required")

    # Check cache first
    cached_url = check_tts_cache(req.text)
    if cached_url:
        return UploadResponse(url=cached_url, cached=True)

    try:
        wav_array, sample_rate = generate_audio(req.text, req.instruction)
        audio_bytes = numpy_to_wav_bytes(wav_array, sample_rate)
        public_url = upload_to_supabase(audio_bytes, req.key)
        save_to_tts_cache(req.text, public_url)
        return UploadResponse(url=public_url, cached=False)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("tts-server:app", host="0.0.0.0", port=7700, reload=False)
