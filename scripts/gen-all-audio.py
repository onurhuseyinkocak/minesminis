#!/Users/jinx/qwen-tts-env/bin/python3
"""
MinesMinis — Batch Audio Generation
Generates ALL word pronunciations and story narrations.
Processes in batches, saves progress to resume if interrupted.
"""
import sys
import os
import json
sys.path.insert(0, os.path.expanduser("~/qwen-tts-env/lib/python3.13/site-packages"))

import numpy as np
import scipy.io.wavfile as wav

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.join(BASE_DIR, "..")
WORDS_DIR = os.path.join(PROJECT_DIR, "public", "audio", "words")
STORIES_DIR = os.path.join(PROJECT_DIR, "public", "audio", "stories")
PROGRESS_FILE = os.path.join(BASE_DIR, ".audio-progress.json")

os.makedirs(WORDS_DIR, exist_ok=True)
os.makedirs(STORIES_DIR, exist_ok=True)

# Voice configs
WORD_VOICE = (
    "A young, warm, crystal-clear female voice. Age around 25. "
    "Speaking to a 5-year-old child, very slowly and distinctly. "
    "Each word is perfectly enunciated. "
    "British English accent, soft and melodic. Patient and kind."
)

STORY_VOICE = (
    "A young, warm, crystal-clear female voice. Age around 25. "
    "Speaking to a 5-year-old child, slowly and clearly with gentle enthusiasm. "
    "Like a loving kindergarten teacher reading a story. "
    "Each word distinct with natural pauses between sentences. "
    "British English accent, soft, melodic, encouraging."
)

# ── Word list (all 462 words sorted by phonics group) ──
WORDS = [
    # Group 1: s,a,t,i,p,n
    "sat","sit","sip","tap","tip","tin","pin","pan","nap","pit","pat","ant","snap","spin","nip","tan",
    # Group 2: c/k,e,h,r,m,d
    "cat","cap","can","kit","kid","ken","keg","pet","pen","peg","net","set","ten","hen","red","men",
    "den","met","hem","hat","hid","had","hot","hug","hum","ran","rat","rip","rug","rub","ram","map",
    "mat","man","mop","mud","mug","mix","dim","dip","dig","dad","dog","dot","dug",
    # Group 3: g,o,u,l,f,b
    "got","gum","gap","get","go","on","off","not","top","pod","log","fog","cup","cut","bus","sun",
    "fun","run","nut","tub","up","us","lot","let","leg","lip","lid","lit","lap","lad","fin","fit",
    "fan","fix","fog","fig","fun","fat","bed","big","bag","bat","bit","bun","box","bad","bob","but",
    # Group 4: ai,j,oa,ie,ee,or
    "rain","tail","paid","pail","jam","jet","jug","jump","jog","coat","boat","road","goat","oak",
    "tie","pie","kite","tree","see","bee","seed","feed","feet","green","corn","fork","sort","born",
    # Group 5: z,w,ng,v,oo
    "zip","zoo","buzz","web","wet","win","wax","wig","ring","sing","song","king","long","van","vet",
    "moon","food","cool","book","look","cook","good","wood","foot",
    # Group 6: y,x,ch,sh,th
    "yes","yet","yak","yam","fox","box","six","mix","wax","max","chin","chip","chat","chop",
    "ship","shop","shed","shut","fish","thin","this","them","that","then","the",
    # Group 7: qu,ou,oi,er,ar
    "quiz","queen","quick","quit","out","loud","our","oil","coin","join","soil","her","fern",
    "car","far","star","jar","farm","park","dark",
    # Common sight words
    "a","an","the","and","is","it","in","on","at","to","I","he","she","we","they","my","me",
    "you","do","no","so","go","up","am","are","was","has","had","can","did","not","but","or",
    "if","of","for","with","from","have","said","see","saw","into","come","came","make","like",
    "look","want","play","help","home","here","there","what","when","where","who","how","why",
    # Basic vocabulary
    "red","blue","green","yellow","orange","pink","purple","black","white","brown",
    "one","two","three","four","five","six","seven","eight","nine","ten",
    "mom","dad","baby","sister","brother","family",
    "head","hand","foot","arm","leg","eye","ear","nose","mouth",
    "cat","dog","fish","bird","bear","duck","frog","hen","pig","cow","sheep","horse",
    "apple","banana","egg","milk","water","rice","bread",
    "happy","sad","big","small","hot","cold","fast","slow","old","new","tall","short",
    "run","jump","sit","stand","eat","drink","sleep","walk","read","sing","dance",
    "sun","moon","star","rain","snow","wind","cloud","sky","flower","tree","leaf",
    "book","pen","bag","desk","chair","door","window",
    "hat","shoe","dress","coat","sock",
    "car","bus","train","bike",
    "house","room","bed","table","cup",
    "ball","toy","doll","game",
    "school","teacher","friend",
    "hello","bye","please","thank","sorry","yes",
]

# Deduplicate preserving order
seen = set()
UNIQUE_WORDS = []
for w in WORDS:
    wl = w.lower()
    if wl not in seen:
        seen.add(wl)
        UNIQUE_WORDS.append(w)

# ── Story scenes ──
# Read from generatedStories later, for now define Group 1-5 built-in stories
BUILT_IN_STORIES = {
    "story_g1_nap": [
        "Nat sat in a pit.",
        "An ant sat on Nat.",
        "Nat can tap, tap, tap!",
        "The ant can nap. Nat sat and sat.",
        "What did Nat do in the pit?",
    ],
    "story_g2_hen": [
        "A red hen met a cat.",
        "The cat hid in a den.",
        "The hen had a map. She ran and ran.",
        "The hen ran to Dad. Dad had a red cap!",
        "Where did the cat hide?",
    ],
    "story_g3_dog_bus": [
        "A big dog got on a bus.",
        "Sit! said the man. But the dog did not sit.",
        "The dog got on the rug and had fun.",
        "A bug sat on a log in the fog. Splat!",
        "What did the big dog do on the bus?",
    ],
    "story_g4_goat_boat": [
        "It began to rain. A goat got on a boat.",
        "The goat went up the road to see a tree.",
        "A bee sat on the tail of the goat. Ouch!",
        "The goat ran for the corn. A green tie was on the tree!",
        "Why did the goat get on the boat?",
    ],
    "story_g5_king_zoo": [
        "A king went to the zoo. He took a long look.",
        "A bee went buzz! Zing! sang the king.",
        "He looked at the cool moon pool. A van was near the wood.",
        "I need food! He cooked a good meal in the moonlight.",
        "What sound did the bee make?",
    ],
}

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {"completed_words": [], "completed_stories": []}

def save_progress(progress):
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f)

def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch", type=str, default="words", choices=["words", "stories", "all"])
    parser.add_argument("--limit", type=int, default=50, help="Max items per run")
    args = parser.parse_args()

    from qwen_tts import Qwen3TTSModel

    progress = load_progress()

    print("Loading Qwen3-TTS model...")
    model = Qwen3TTSModel.from_pretrained(
        "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign",
        device_map="cpu",
        dtype="float32"
    )
    print("Model ready.\n")

    generated = 0

    if args.batch in ("words", "all"):
        done_words = set(progress["completed_words"])
        todo = [w for w in UNIQUE_WORDS if w.lower() not in done_words]
        print(f"Words: {len(done_words)} done, {len(todo)} remaining\n")

        for word in todo[:args.limit]:
            out_path = os.path.join(WORDS_DIR, f"{word.lower()}.wav")
            if os.path.exists(out_path):
                progress["completed_words"].append(word.lower())
                save_progress(progress)
                continue

            print(f"  [{generated+1}] Word: {word}")
            try:
                wavs, sr = model.generate_voice_design(
                    text=word,
                    instruct=WORD_VOICE,
                    language="english",
                    do_sample=True,
                    temperature=0.5,
                )
                audio = wavs[0]
                audio = audio / (np.abs(audio).max() + 1e-8)
                wav.write(out_path, sr, (audio * 32767).astype(np.int16))
                dur = len(audio) / sr
                print(f"       -> {dur:.1f}s saved")
            except Exception as e:
                print(f"       ERROR: {e}")
                continue

            progress["completed_words"].append(word.lower())
            save_progress(progress)
            generated += 1

            if generated >= args.limit:
                break

    if args.batch in ("stories", "all") and generated < args.limit:
        done_stories = set(progress["completed_stories"])

        for story_id, scenes in BUILT_IN_STORIES.items():
            if story_id in done_stories:
                continue
            if generated >= args.limit:
                break

            story_dir = os.path.join(STORIES_DIR, story_id)
            os.makedirs(story_dir, exist_ok=True)
            print(f"\n  Story: {story_id}")

            all_ok = True
            for i, text in enumerate(scenes):
                file_id = f"scene_{i+1}" if i < len(scenes)-1 else "question"
                out_path = os.path.join(story_dir, f"{file_id}.wav")
                if os.path.exists(out_path):
                    continue

                print(f"    [{file_id}] {text[:50]}...")
                try:
                    wavs, sr = model.generate_voice_design(
                        text=text,
                        instruct=STORY_VOICE,
                        language="english",
                        do_sample=True,
                        temperature=0.6,
                    )
                    audio = wavs[0]
                    audio = audio / (np.abs(audio).max() + 1e-8)
                    wav.write(out_path, sr, (audio * 32767).astype(np.int16))
                    dur = len(audio) / sr
                    print(f"           -> {dur:.1f}s saved")
                except Exception as e:
                    print(f"           ERROR: {e}")
                    all_ok = False
                    continue

                generated += 1

            if all_ok:
                progress["completed_stories"].append(story_id)
                save_progress(progress)

    print(f"\n{'='*50}")
    print(f"Generated {generated} audio files this run")
    print(f"Total words done: {len(progress['completed_words'])}/{len(UNIQUE_WORDS)}")
    print(f"Total stories done: {len(progress['completed_stories'])}/{len(BUILT_IN_STORIES)}")
    print(f"{'='*50}")
    save_progress(progress)

if __name__ == "__main__":
    main()
