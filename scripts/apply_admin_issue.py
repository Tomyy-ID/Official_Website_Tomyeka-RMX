import base64
import json
import os
import re
import sys
from pathlib import Path

event_path = os.environ.get("GITHUB_EVENT_PATH")
if not event_path:
    raise SystemExit("GITHUB_EVENT_PATH tidak tersedia.")

with open(event_path, "r", encoding="utf-8") as f:
    event = json.load(f)

issue = event.get("issue") or {}
sender = (event.get("sender") or {}).get("login", "")
label = (event.get("label") or {}).get("name", "")

# Hanya pemilik repository yang dapat menyetujui dengan menambahkan label ini.
if sender.lower() != "tomyy-id" or label != "admin-approved":
    raise SystemExit("Pengajuan tidak disetujui oleh pemilik repository.")

body = issue.get("body") or ""

def section(name, next_name=None):
    pattern = rf"(?ms)^### {re.escape(name)}\s*\n(.*?)(?=^### |\Z)"
    match = re.search(pattern, body)
    if not match:
        raise SystemExit(f"Bagian '{name}' tidak ditemukan di Issue.")
    return match.group(1).strip()

kind = section("Jenis perubahan").strip()
target = section("Path tujuan").strip()
fmt = section("Format konten").strip().lower()
payload = section("Isi file (Base64)").strip()
message = section("Pesan commit").strip() or "Update melalui pengajuan admin FLM"

if fmt != "base64":
    raise SystemExit("Format konten harus base64.")

if not re.fullmatch(r"[A-Za-z0-9+/=\s]+", payload):
    raise SystemExit("Konten Base64 berisi karakter tidak valid.")

try:
    content = base64.b64decode(re.sub(r"\s+", "", payload), validate=True)
except Exception as exc:
    raise SystemExit(f"Base64 tidak valid: {exc}")

if not content:
    raise SystemExit("File kosong tidak diizinkan.")
if len(content) > 45 * 1024:
    raise SystemExit("Ukuran file melebihi batas 45 KB untuk pengajuan Issue.")

if kind == "EDIT_CONFIG":
    if target != "pengaturan-data.js":
        raise SystemExit("EDIT_CONFIG hanya boleh mengubah pengaturan-data.js.")
elif kind == "UPLOAD":
    if not target.startswith("assets/"):
        raise SystemExit("UPLOAD hanya boleh menulis ke folder assets/.")
    if ".." in Path(target).parts or target.startswith("/") or "\\" in target:
        raise SystemExit("Path tujuan tidak aman.")
    allowed = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".mp3", ".mp4", ".pdf", ".txt", ".json", ".css", ".js", ".html"}
    if Path(target).suffix.lower() not in allowed:
        raise SystemExit("Ekstensi file tidak diizinkan.")
else:
    raise SystemExit("Jenis perubahan tidak dikenal.")

if ".." in Path(target).parts or target.startswith("/") or "\\" in target:
    raise SystemExit("Path tujuan tidak aman.")

destination = Path(target)
destination.parent.mkdir(parents=True, exist_ok=True)
destination.write_bytes(content)

# Commit message dipakai sebagai informasi; batasi panjang dan karakter kontrol.
message = re.sub(r"[\r\n\x00-\x1f]+", " ", message).strip()[:120]
print(f"Pengajuan Issue #{issue.get('number')} siap diterapkan ke {target}.")
print(f"Pesan commit: {message}")
