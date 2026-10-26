import os
import asyncio
import logging

logger = logging.getLogger(__name__)


async def send_whatsapp_alert(*, reference: str, name: str, business: str, project_type: str, language: str) -> bool:
    sid = os.environ.get("TWILIO_ACCOUNT_SID")
    token = os.environ.get("TWILIO_AUTH_TOKEN")
    sender = os.environ.get("TWILIO_WHATSAPP_FROM")
    notify_to = os.environ.get("WHATSAPP_NOTIFY_TO")
    if not (sid and token and sender and notify_to):
        logger.info("WhatsApp alert skipped: Twilio env vars not configured")
        return False

    body = (
        f"New project inquiry — {reference}\n"
        f"Name: {name}\nBusiness: {business}\nType: {project_type}\nLang: {language.upper()}\n"
        f"Open the admin dashboard for details."
    )

    def _send():
        from twilio.rest import Client
        client = Client(sid, token)
        msg = client.messages.create(from_=sender, to=notify_to, body=body)
        return msg.sid

    try:
        msg_sid = await asyncio.to_thread(_send)
        logger.info(f"WhatsApp alert sent: {msg_sid}")
        return True
    except Exception as e:
        logger.error(f"WhatsApp alert failed: {e}")
        return False
