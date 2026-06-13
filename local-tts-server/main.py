from fastapi import FastAPI, Header, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pathlib import Path
import hashlib
import os

app = FastAPI()

OUTPUT_DIR = Path("generated-audio")
OUTPUT_DIR.mkdir(exist_ok=True)

LOCAL_TTS_SECRET = os.getenv("LOCAL_TTS_SECRET", "dev-secret")

app.mount("/audio", StaticFiles(directory=str(OUTPUT_DIR)), name="audio")


class SynthesizeRequest(BaseModel):
    provider: str
    voice: str
    text: str
    speed: float = 1.0
    format: str = "mp3"


@app.post("/synthesize")
def synthesize(
    payload: SynthesizeRequest,
    x_internal_secret: str | None = Header(default=None),
):
    if x_internal_secret != LOCAL_TTS_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

    if payload.provider not in ["piper", "kokoro"]:
        raise HTTPException(status_code=400, detail="Unsupported local provider")

    text_hash = hashlib.sha256(
        f"{payload.provider}:{payload.voice}:{payload.speed}:{payload.text}".encode()
    ).hexdigest()

    output_file = OUTPUT_DIR / f"{text_hash}.{payload.format}"

    if output_file.exists():
        return {
            "audioUrl": f"http://localhost:8008/audio/{output_file.name}",
            "durationMs": None,
            "contentType": "audio/mpeg",
            "fromCache": True,
        }

    if payload.provider == "piper":
        generate_with_piper(payload, output_file)
    elif payload.provider == "kokoro":
        generate_with_kokoro(payload, output_file)

    return {
        "audioUrl": f"http://localhost:8008/audio/{output_file.name}",
        "durationMs": None,
        "contentType": "audio/mpeg",
        "fromCache": False,
    }


def generate_with_piper(payload: SynthesizeRequest, output_file: Path):
    raise HTTPException(
        status_code=501,
        detail="Piper is not wired yet. Install Piper and configure model paths.",
    )


def generate_with_kokoro(payload: SynthesizeRequest, output_file: Path):
    raise HTTPException(
        status_code=501,
        detail="Kokoro is not wired yet. Install Kokoro and configure local runtime.",
    )
