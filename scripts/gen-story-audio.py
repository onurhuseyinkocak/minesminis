#!/Users/jinx/qwen-tts-env/bin/python3
"""
MinesMinis — Story Audio Generation v2
Qwen3-TTS VoiceDesign — warm, clear, child-friendly narrator.
Lower temperature for consistency, slower pace for children.
"""
import sys
import os
sys.path.insert(0, os.path.expanduser("~/qwen-tts-env/lib/python3.13/site-packages"))

import numpy as np
import scipy.io.wavfile as wav
from qwen_tts import Qwen3TTSModel

MODEL = "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign"
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "audio", "stories")
os.makedirs(OUT_DIR, exist_ok=True)

# Optimized voice prompt for children's story narration
VOICE = (
    "A young, warm, crystal-clear female voice. Age around 25. "
    "Speaking to a 5-year-old child, very slowly and distinctly. "
    "Each word is perfectly enunciated with gentle pauses between words. "
    "Enthusiastic but calm. Like a loving kindergarten teacher. "
    "British English accent, soft and melodic. "
    "Natural breathing pauses. No rushing. Patient and kind."
)

# ── Story: "Nat and the Ant" (Group 1) ──
STORY_ID = "story_g1_nap"
LINES = [
    ("scene_1", "Nat... sat... in a pit."),
    ("scene_2", "An ant... sat on Nat."),
    ("scene_3", "Nat can tap... tap... tap!"),
    ("scene_4", "The ant can nap. Nat sat... and sat."),
    ("question", "What did Nat do... in the pit?"),
]

print("Loading Qwen3-TTS model...")
model = Qwen3TTSModel.from_pretrained(MODEL, device_map="cpu", dtype="float32")
print("Model ready.\n")

story_dir = os.path.join(OUT_DIR, STORY_ID)
os.makedirs(story_dir, exist_ok=True)

for name, text in LINES:
    out_path = os.path.join(story_dir, f"{name}.wav")
    print(f"Generating [{name}]: \"{text}\"")
    wavs, sr = model.generate_voice_design(
        text=text,
        instruct=VOICE,
        language="english",
        do_sample=True,
        temperature=0.6,  # lower = more consistent, clearer
    )
    audio = wavs[0]
    audio = audio / (np.abs(audio).max() + 1e-8)
    audio_int16 = (audio * 32767).astype(np.int16)
    wav.write(out_path, sr, audio_int16)
    dur = len(audio) / sr
    print(f"  -> {out_path}  ({dur:.1f}s)\n")

print(f"Done! {len(LINES)} audio files for {STORY_ID}")
