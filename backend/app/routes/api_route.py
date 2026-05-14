import logging
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from ..controllers import AgentController, SendEmailController
from ..middleware.auth import get_current_user, TokenPayload
from ..models.answer import Answer
from ..models.user_email import UserEmail

logger = logging.getLogger(__name__)
api_route = APIRouter()


def get_agent_controller():
    return AgentController()


def get_email_controller():
    return SendEmailController()


def _stream_agent_response(data: Answer, controller: AgentController):
    return StreamingResponse(
        controller.stream_response(data),
        media_type="text/event-stream",
    )


@api_route.post("/chat")
def chat(
    data: Answer,
    controller: AgentController = Depends(get_agent_controller),
    current_user: TokenPayload = Depends(get_current_user),
):
    return _stream_agent_response(data, controller)


@api_route.post("/sendEmail", status_code=201)
def sending_email(
    data: UserEmail,
    controller: SendEmailController = Depends(get_email_controller),
    current_user: TokenPayload = Depends(get_current_user),
):
    try:
        controller.post_send_email(data)
        return {"success": True, "message": "Email enviado con éxito"}
    except HTTPException:
        raise
    except ValueError as e:
        logger.exception("Error de configuración en /sendEmail: %s", str(e))
        raise HTTPException(status_code=500, detail="Error de configuración del servicio")
    except Exception as e:
        logger.exception("Error inesperado en /sendEmail: %s", str(e))
        raise HTTPException(status_code=500, detail="Error al enviar el email")
