# Test Credentials

## Admin (VORTEX Digital)
- URL: /admin/login
- Email: admin@vortex.digital
- Password: Vortex@2026!
- Role: admin
- (Test credentials — change before going live. Password can be rotated by updating ADMIN_PASSWORD in backend/.env and restarting the backend.)

## Auth endpoints
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/auth/refresh

## Notes
- JWT access token (httpOnly cookie, 8h) + refresh token (7d). Brute-force lockout: 5 failed attempts -> 15 min.
- Public site: /en and /ar (language switcher in navbar, persisted in localStorage).
- Inquiry email notifications go to mohamadaboaloyoun3@gmail.com (set in Admin -> Settings). Verified delivering (202).
- WhatsApp alerts: code is wired (whatsapp_utils.py) but INACTIVE until TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM are added via the secrets card. Recipient: whatsapp:+963937224584 (WHATSAPP_NOTIFY_TO in backend/.env).
