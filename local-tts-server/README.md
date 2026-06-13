# Klassruum Local TTS Server

Run local TTS server:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
LOCAL_TTS_SECRET=dev-secret uvicorn main:app --host 0.0.0.0 --port 8008
```

Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
$env:LOCAL_TTS_SECRET="dev-secret"
uvicorn main:app --host 0.0.0.0 --port 8008
```

The server exposes `POST /synthesize` and is intentionally local/private. Kokoro
and Piper integration points return clear `501` responses until their runtimes
and model paths are configured.
