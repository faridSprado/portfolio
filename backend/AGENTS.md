# Backend Coding Standards

> **Índice de referencia** — Ver archivos específicos para cada sección.

## Estructura de Documentación

| Archivo | Descripción |
|---------|-------------|
| [`.agents/backend.md`](.agents/backend.md) | Stack, reglas de código, patrones Python/FastAPI/Ollama/RAG |
| [`.agents/architect.md`](.agents/architect.md) | Arquitectura, modularidad, POO |
| [`.agents/devops.md`](.agents/devops.md) | Docker, CI/CD, variables de entorno |
| [`.agents/reviewer.md`](.agents/reviewer.md) | Reglas de code review |
| [`specs/01-product-spec.md`](specs/01-product-spec.md) | Especificación de features |
| [`specs/02-architecture.md`](specs/02-architecture.md) | Diseño técnico |
| [`specs/03-tasks.md`](specs/03-tasks.md) | Tasks implementadas y pendientes |

## Quick Reference

### Scripts Útiles

```bash
# Run con hot reload
uvicorn app.main:app --reload --port 8000
```

### Type Hints

```python
# ✅ CORRECTO
def function(param: str) -> List[Dict[str, Any]]:
    ...

# ❌ INCORRECTO  
def function(param):
    ...
```

## Stack

- **Language**: Python 3.12+
- **Framework**: FastAPI + Uvicorn
- **AI**: Ollama (qwen2.5:0.5b) + nomic-embed-text
- **Validation**: Pydantic
- **Computing**: numpy
