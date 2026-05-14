from ..services.send_email import SendEmail
from ..models import UserEmail

class SendEmailController():
    def __init__(self):
        self.service = SendEmail()

    def post_send_email(self, data: UserEmail):
        return self.service.sending_email(data)
