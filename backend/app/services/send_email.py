import os
import resend
from ..models import UserEmail


class SendEmail:
    def __init__(self) -> None:
        api_key = os.getenv("RESEND_API_KEY")
        if not api_key:
            raise ValueError("RESEND_API_KEY no configurada")
        resend.api_key = api_key
        self.contact_email = os.getenv("CONTACT_EMAIL", "faridvzx@gmail.com")
        self.from_email = os.getenv("RESEND_FROM_EMAIL", "Portfolio Farid <onboarding@resend.dev>")

    def sending_email(self, data: UserEmail):
        html = f"""
        <h2>Nuevo contacto desde el portfolio de Farid</h2>
        <p><strong>Nombre:</strong> {data.name}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>{data.consulta}</p>
        """
        params: resend.Emails.SendParams = {
            "from": self.from_email,
            "to": [self.contact_email],
            "reply_to": data.email,
            "subject": f"Portfolio Farid - contacto de {data.name}",
            "html": html,
        }
        return resend.Emails.send(params)
