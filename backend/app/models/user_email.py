from pydantic import BaseModel

class UserEmail(BaseModel):
    name: str
    email: str
    consulta: str
