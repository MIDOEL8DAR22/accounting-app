import os
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
WORK = os.path.join(HERE, "_work")
os.makedirs(WORK, exist_ok=True)

VOICE_ID = "047cdec372454af7a3ba61b4c5ede605"
MODEL = "s2.1-pro-free"
MAX_CHUNK = 180
SPEED = 1.1


def split_text(text: str):
    text = re.sub(r"\s+", " ", text).strip()
    parts = []
    buf = ""
    for sent in re.split(r"(?<=[.؟!])\s*", text):
        if not sent.strip():
            continue
        if len(buf) + len(sent) + 1 <= MAX_CHUNK:
            buf = (buf + " " + sent).strip()
        else:
            if buf:
                parts.append(buf)
            if len(sent) <= MAX_CHUNK:
                buf = sent
            else:
                words = sent.split()
                cur = ""
                for w in words:
                    if len(cur) + len(w) + 1 <= MAX_CHUNK:
                        cur = (cur + " " + w).strip()
                    else:
                        parts.append(cur)
                        cur = w
                buf = cur
    if buf.strip():
        parts.append(buf.strip())
    return parts


def synth(text: str, out: str):
    key = os.environ.get("FISH_KEY", "")
    if not key:
        raise RuntimeError("FISH_KEY env not set")
    body = {
        "text": text,
        "reference_id": VOICE_ID,
        "format": "mp3",
        "prosody": {"speed": SPEED},
    }
    payload = urllib.parse.urlencode({}).encode()
    data = json_dumps(body).encode("utf-8")
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
            with urllib.request.urlopen(req, timeout=120) as resp:
                raw = resp.read()
            if len(raw) < 1000:
                raise RuntimeError(f"too small {len(raw)}")
            with open(out, "wb") as f:
                f.write(raw)
            return
        except Exception as e:
            wait = 3 * (attempt + 1)
            print(f"  retry {attempt + 1} after {wait}s: {e}")
            time.sleep(wait)
    raise RuntimeError(f"failed: {text[:40]}")


def json_dumps(obj):
    import json

    return json.dumps(obj, ensure_ascii=False)


def silence(ms: int, out: str):
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi",
         "-i", f"anullsrc=r=44100:cl=mono", "-t", f"{ms / 1000:.3f}",
         "-q:a", "9", out],
        check=True,
    )


def concat(files: list, out: str):
    lst = os.path.join(WORK, "list_fish.txt")
    with open(lst, "w", encoding="utf-8") as f:
        for p in files:
            f.write(f"file '{p.replace(os.sep, '/')}'\n")
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0",
         "-i", lst, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
         "-c:a", "libmp3lame", "-b:a", "128k", "-ar", "44100",
         "-ac", "1", out],
        check=True,
    )


def main():
    lesson = sys.argv[1] if len(sys.argv) > 1 else "l1"
    src = os.path.join(HERE, "course1", f"{lesson}.txt")
    with open(src, encoding="utf-8-sig") as f:
        text = f.read()
    chunks = split_text(text)
    print(f"{lesson}: {len(chunks)} chunks")
    parts = []
    for i, c in enumerate(chunks):
        cfile = os.path.join(WORK, f"fish_{lesson}_{i:03d}.mp3")
        gap = os.path.join(WORK, f"fish_{lesson}_{i:03d}_gap.mp3")
        print(f"  {i + 1}/{len(chunks)} ({len(c)} chars)")
        synth(c, cfile)
        dur = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "csv=p=0", cfile],
            capture_output=True, text=True,
        ).stdout.strip()
        print(f"    -> {dur}s")
        parts.append(cfile)
        if i < len(chunks) - 1:
            silence(180, gap)
            parts.append(gap)
    outdir = os.path.join(HERE, "..", "..", "public", "audio", "course1")
    os.makedirs(outdir, exist_ok=True)
    final = os.path.join(outdir, f"{lesson}.mp3")
    concat(parts, final)
    print(f"done -> {final} ({os.path.getsize(final)} bytes)")


if __name__ == "__main__":
    main()