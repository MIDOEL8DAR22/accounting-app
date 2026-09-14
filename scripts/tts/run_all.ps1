param([string]$Voice = "google")
$root = Split-Path -Parent $PSScriptRoot
$root = Split-Path -Parent $root
Set-Location -LiteralPath $root
1..7 | ForEach-Object {
  python scripts/tts/build_audio.py "l$_" $Voice
}