from typing import Generator

from ..models.answer import Answer
from ..services.gemini_connection import GeminiService


class AgentController:
    def __init__(self):
        self.service = GeminiService()

    def stream_response(self, data: Answer) -> Generator[str, None, None]:
        try:
            return self.service.get_response(data.message)
        except Exception:
            error_msg = "Lo siento, estoy teniendo problemas técnicos. También puedes contactar a Farid en faridvzx@gmail.com."
            return iter([f"data:{error_msg}\n\n", "data:[DONE]\n\n"])
