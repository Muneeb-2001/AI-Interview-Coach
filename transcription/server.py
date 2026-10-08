from fastapi import FastAPI, UploadFile, File
from faster_whisper import WhisperModel
import tempfile
import os

app = FastAPI()

print("Loading Whisper tiny...")
model = WhisperModel(
    "tiny",
    device="cpu",
    compute_type="int8",
    cpu_threads=4,
    num_workers=1
)
print("Whisper tiny loaded.")


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename or ".webm")[1] or ".webm"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as temp:
        temp.write(await file.read())
        temp_path = temp.name

    try:
        segments, info = model.transcribe(
            temp_path,
            language="en",
            beam_size=5,
            best_of=5,
            temperature=0,
            vad_filter=True,
            vad_parameters={
                "min_silence_duration_ms": 500,
                "speech_pad_ms": 200,
            },
            condition_on_previous_text=False,
            no_speech_threshold=0.6,
            compression_ratio_threshold=2.4,
            log_prob_threshold=-1.0,
        )

        parts = []

        for segment in segments:
            text = segment.text.strip()

            if text:
                parts.append(text)

        text = " ".join(parts)

        return {
            "text": text,
            "language": info.language,
        }

    finally:
        try:
            os.remove(temp_path)
        except OSError:
            pass
