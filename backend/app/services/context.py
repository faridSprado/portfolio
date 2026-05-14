from collections import Counter
import re

from .content_store import PortfolioContentStore


class Context:
    def __init__(self):
        self.content_store = PortfolioContentStore()
        self.system_prompt = self._load_system_prompt()
        self.chunks = self._build_chunks(self._content_text())

    @staticmethod
    def _load_system_prompt() -> str:
        from pathlib import Path

        base = Path(__file__).parent.parent / "db"
        return (base / "system_prompt.md").read_text(encoding="utf-8")

    @staticmethod
    def _tokenize(text: str) -> list[str]:
        return [token for token in re.findall(r"[a-záéíóúñü0-9]+", text.lower()) if len(token) > 2]

    @staticmethod
    def _build_chunks(text: str) -> list[str]:
        sections = re.split(r"\n(?=##?\s)", text)
        chunks: list[str] = []
        for section in sections:
            clean = section.strip()
            if not clean:
                continue
            if len(clean) <= 1400:
                chunks.append(clean)
                continue
            paragraphs = [p.strip() for p in clean.split("\n\n") if p.strip()]
            current = ""
            for paragraph in paragraphs:
                candidate = f"{current}\n\n{paragraph}".strip()
                if len(candidate) > 1400 and current:
                    chunks.append(current)
                    current = paragraph
                else:
                    current = candidate
            if current:
                chunks.append(current)
        return chunks

    def _content_text(self) -> str:
        """Return the current editable portfolio content as the single source of truth.

        The assistant used to mix an old static context.md with the editable JSON.
        That caused deleted projects to keep appearing in answers. Keeping only the
        current JSON-backed content guarantees the AI talks about the same portfolio
        the visitor sees and the admin edits.
        """
        try:
            return self.content_store.as_markdown().strip()
        except Exception:
            return (
                "# Contenido del portfolio no disponible\n\n"
                "No hay contenido editable cargado. Responde con honestidad y sugiere contactar a Farid directamente."
            )

    def retrieve(self, query: str, top_k: int = 8) -> str:
        """Lightweight keyword RAG for the current editable portfolio."""
        self.chunks = self._build_chunks(self._content_text())
        query_terms = Counter(self._tokenize(query))
        if not query_terms:
            return "\n\n---\n\n".join(self.chunks[:top_k])

        scored: list[tuple[int, int, str]] = []
        for index, chunk in enumerate(self.chunks):
            chunk_terms = Counter(self._tokenize(chunk))
            overlap = sum(query_terms[token] * chunk_terms.get(token, 0) for token in query_terms)
            lower_chunk = chunk.lower()
            bonus = 0
            if "## proyectos" in lower_chunk or "###" in lower_chunk:
                bonus += 1
            if any(term in lower_chunk for term in ["farid", "inteligencia artificial", "ingeniería multimedia"]):
                bonus += 2
            scored.append((overlap + bonus, -index, chunk))

        selected = [chunk for score, _, chunk in sorted(scored, reverse=True) if score > 0][:top_k]
        if not selected:
            selected = self.chunks[:top_k]
        return "\n\n---\n\n".join(selected)
