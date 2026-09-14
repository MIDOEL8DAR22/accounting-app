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

MAX_CHUNK = 180
SENT_END = re.compile(r"(?<=[.؟!।،؛:])\s+|(?<=[.؟!])\s*", re.UNICODE)


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


def synth_google(text: str, out: str):
    url = (
        "https://translate.google.com/translate_tts"
        f"?ie=UTF-8&tl=ar&client=tw-ob&q={urllib.parse.quote(text)}&ttsspeed=1"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
    for attempt in range(6):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = resp.read()
            if len(data) < 2000:
                raise RuntimeError(f"too small {len(data)}")
            with open(out, "wb") as f:
                f.write(data)
            return
        except Exception as e:
            wait = 3 * (attempt + 1)
            print(f"  retry {attempt + 1} after {wait}s: {e}")
            time.sleep(wait)
    raise RuntimeError(f"failed: {text[:40]}")


def synth_edge(text: str, out: str, voice: str):
    import asyncio
    import edge_tts

    asyncio.run(edge_tts.Communicate(text, voice).save(out))


def synth(text: str, out: str, voice: str):
    if voice == "google":
        synth_google(text, out)
    else:
        synth_edge(text, out, voice)


def silence(ms: int, out: str):
    subprocess.run(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "lavfi",
         "-i", f"anullsrc=r=44100:cl=mono", "-t", f"{ms / 1000:.3f}",
         "-q:a", "9", out],
        check=True,
    )


def concat(files: list, out: str):
    lst = os.path.join(WORK, "list.txt")
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
    voice = sys.argv[2] if len(sys.argv) > 2 else "google"
    course = sys.argv[3] if len(sys.argv) > 3 else "course1"
    src = os.path.join(HERE, course, f"{lesson}.txt")
    with open(src, encoding="utf-8-sig") as f:
        text = f.read()
    chunks = split_text(text)
    print(f"{lesson} ({voice}): {len(chunks)} chunks")
    parts = []
    for i, c in enumerate(chunks):
        cfile = os.path.join(WORK, f"{lesson}_{i:03d}.mp3")
        gap = os.path.join(WORK, f"{lesson}_{i:03d}_gap.mp3")
        print(f"  {i + 1}/{len(chunks)} ({len(c)} chars)")
        synth(c, cfile, voice)
        parts.append(cfile)
        if i < len(chunks) - 1:
            silence(180, gap)
            parts.append(gap)
        time.sleep(0.7)
    outdir = os.path.join(HERE, "..", "..", "public", "audio", course)
    os.makedirs(outdir, exist_ok=True)
    final = os.path.join(outdir, f"{lesson}.mp3")
    concat(parts, final)
    print(f"done -> {final} ({os.path.getsize(final)} bytes)")


if __name__ == "__main__":
    main()