import os
import re
import subprocess
import sys
import time
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.join(HERE, "_work")
os.makedirs(WORK, exist_ok=True)

VOICE_ID = "047cdec372454af7a3ba61b4c5ede605"
MODEL = "s2.1-pro-free"
SPEED = 1.0


def synth(text: str, out: str):
    key = os.environ.get("FISH_KEY", "")
    if not key:
        raise RuntimeError("FISH_KEY env not set")
    import json

    body = {
        "text": text,
        "reference_id": VOICE_ID,
        "format": "mp3",
        "prosody": {"speed": SPEED},
    }
    data = json.dumps(body, ensure_ascii=False).encode("utf-8")
    for attempt in range(6):
        try:
            req = urllib.request.Request(
                "https://api.fish.audio/v1/tts",
                data=data,
                headers={
                    "Authorization": f"Bearer {key}",
                    "model": MODEL,
                    "Content-Type": "application/json",
                },
            )
            with urllib.request.urlopen(req, timeout=300) as resp:
                raw = resp.read()
            if len(raw) < 1000:
                raise RuntimeError(f"too small {len(raw)}")
            with open(out, "wb") as f:
                f.write(raw)
            return
        except Exception as e:
            wait = 4 * (attempt + 1)
            print(f"  retry {attempt + 1} after {wait}s: {e}")
            time.sleep(wait)
    raise RuntimeError(f"failed: {text[:40]}")


def normalize(infile: str, out: str):
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-i", infile,
         "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
         "-c:a", "libmp3lame", "-b:a", "128k", "-ar", "44100",
         "-ac", "1", out],
        check=True,
    )


def main():
    lesson = sys.argv[1] if len(sys.argv) > 1 else "l1"
    course = sys.argv[2] if len(sys.argv) > 2 else "course1"
    src = os.path.join(HERE, course, f"{lesson}.txt")
    with open(src, encoding="utf-8-sig") as f:
        text = re.sub(r"\s+", " ", f.read()).strip()
    print(f"{lesson}: {len(text)} chars (single request)")
    wav_src = os.path.join(WORK, f"one_{lesson}.mp3")
    synth(text, wav_src)
    dur = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", wav_src],
        capture_output=True, text=True,
    ).stdout.strip()
    print(f"  raw duration: {dur}s")
    outdir = os.path.join(HERE, "..", "..", "public", "audio", course)
    os.makedirs(outdir, exist_ok=True)
    final = os.path.join(outdir, f"{lesson}.mp3")
    normalize(wav_src, final)
    print(f"done -> {final} ({os.path.getsize(final)} bytes)")


if __name__ == "__main__":
    main()