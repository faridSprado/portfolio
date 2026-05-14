from typing import Generator
import logging
import os

from google import genai
from google.genai import types

from ..services.context import Context

logger = logging.getLogger(__name__)


class GeminiService:
    def __init__(self):
        self.context = Context()
        self.model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
        self.api_key = os.getenv("GEMINI_API_KEY", "")
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None

    @staticmethod
    def _format_sse(text: str) -> str:
        if text == "":
            return "data:\n\n"
        lines = text.split("\n")
        return "".join(f"data:{line}\n" for line in lines) + "\n"

    def get_response(self, message: str) -> Generator[str, None, None]:
        if not self.client:
            yield self._format_sse(
                "No tengo configurada la clave de Gemini todavía. Define `GEMINI_API_KEY` en el backend para activar el asistente."
            )
            yield "data:[DONE]\n\n"
            return

        retrieved_context = self.context.retrieve(message)
        system_instruction = f"{self.context.system_prompt}\n\n## Contexto recuperado\n{retrieved_context}"

        try:
            stream = self.client.models.generate_content_stream(
                model=self.model,
                contents=message,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=float(os.getenv("GEMINI_TEMPERATURE", "0.55")),
                    max_output_tokens=int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "2500")),
                ),
            )
            finish_reason = None
            for chunk in stream:
                text = getattr(chunk, "text", None)
                if text:
                    yield self._format_sse(text)
                candidates = getattr(chunk, "candidates", None) or []
                if candidates:
                    finish_reason = getattr(candidates[0], "finish_reason", finish_reason)

            if finish_reason and "MAX_TOKENS" in str(finish_reason):
                yield self._format_sse(
                    "\n\nPuedo continuar o ampliar esta respuesta si quieres más detalle."
                )
            yield "data:[DONE]\n\n"
        except Exception as exc:
            logger.exception("Gemini request failed: %s", exc)
            yield self._format_sse(
                "Tuve un problema al consultar Gemini. Puedes intentar de nuevo o contactar a Farid en faridvzx@gmail.com."
            )
            yield "data:[DONE]\n\n"
