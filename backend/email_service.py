import os
import httpx
from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
FRONTEND_URL   = os.getenv("FRONTEND_URL", "https://nexttalent.ma")
FROM_EMAIL     = os.getenv("FROM_EMAIL", "onboarding@resend.dev")


def send_email(to_email: str, subject: str, html: str) -> bool:
    """Envoie un email via l'API Resend (HTTP)."""
    try:
        response = httpx.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "from": f"NextTalent <{FROM_EMAIL}>",
                "to": [to_email],
                "subject": subject,
                "html": html,
            },
            timeout=10,
        )
        if response.status_code == 200 or response.status_code == 201:
            print(f"✅ Email envoyé à {to_email}")
            return True
        else:
            print(f"❌ Erreur Resend : {response.status_code} — {response.text}")
            return False
    except Exception as e:
        print(f"❌ Erreur envoi email : {e}")
        return False


def send_verification_email(to_email: str, nom: str, token: str) -> bool:
    """Envoie l'email de confirmation d'inscription."""
    verify_url = f"{FRONTEND_URL}/verify-email?token={token}"

    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #F7F8FC; margin: 0; padding: 0; }}
        .container {{ max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(79,70,229,.12); }}
        .header {{ background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 36px 40px; text-align: center; }}
        .logo {{ color: #fff; font-size: 28px; font-weight: 800; letter-spacing: -.02em; }}
        .logo span {{ opacity: .7; font-size: 14px; display: block; margin-top: 4px; font-weight: 400; }}
        .body {{ padding: 36px 40px; }}
        .title {{ font-size: 22px; font-weight: 700; color: #1F2937; margin-bottom: 12px; }}
        .text {{ font-size: 15px; color: #6B7280; line-height: 1.7; margin-bottom: 16px; }}
        .btn {{ display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: #fff !important; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 700; font-size: 15px; margin: 20px 0; }}
        .link {{ font-size: 12px; color: #9CA3AF; word-break: break-all; margin-top: 16px; }}
        .footer {{ background: #F9FAFB; padding: 20px 40px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; }}
        .warning {{ background: #FFFBEB; border-left: 3px solid #F59E0B; padding: 12px 16px; border-radius: 0 8px 8px 0; font-size: 13px; color: #92400E; margin-top: 20px; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">💼 NextTalent<span>Plateforme intelligente de recrutement IA</span></div>
        </div>
        <div class="body">
          <div class="title">Bonjour {nom} 👋</div>
          <p class="text">Merci de vous être inscrit sur <strong>NextTalent</strong> ! Pour activer votre compte, veuillez confirmer votre adresse email :</p>
          <div style="text-align: center;">
            <a href="{verify_url}" class="btn">✅ Confirmer mon email</a>
          </div>
          <p class="text">Si le bouton ne fonctionne pas, copiez ce lien :</p>
          <p class="link">{verify_url}</p>
          <div class="warning">
            ⏰ Ce lien est valable pendant <strong>24 heures</strong>. Si vous n'avez pas créé de compte sur NextTalent, ignorez cet email.
          </div>
        </div>
        <div class="footer">
          © 2026 NextTalent · nexttalent.ma · Email envoyé automatiquement.
        </div>
      </div>
    </body>
    </html>
    """

    return send_email(
        to_email=to_email,
        subject="✅ Confirmez votre email — NextTalent",
        html=html,
    )


def send_welcome_email(to_email: str, nom: str) -> bool:
    """Envoie un email de bienvenue après confirmation."""
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #F7F8FC; margin: 0; padding: 0; }}
        .container {{ max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(79,70,229,.12); }}
        .header {{ background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 36px 40px; text-align: center; }}
        .logo {{ color: #fff; font-size: 28px; font-weight: 800; }}
        .body {{ padding: 36px 40px; }}
        .title {{ font-size: 22px; font-weight: 700; color: #1F2937; margin-bottom: 12px; }}
        .text {{ font-size: 15px; color: #6B7280; line-height: 1.7; margin-bottom: 16px; }}
        .btn {{ display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: #fff !important; text-decoration: none; padding: 14px 36px; border-radius: 10px; font-weight: 700; font-size: 15px; margin: 20px 0; }}
        .feature {{ display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; }}
        .icon {{ font-size: 22px; flex-shrink: 0; }}
        .footer {{ background: #F9FAFB; padding: 20px 40px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #E5E7EB; }}
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">💼 NextTalent</div>
        </div>
        <div class="body">
          <div class="title">🎉 Bienvenue sur NextTalent, {nom} !</div>
          <p class="text">Votre compte a été activé avec succès. Accédez à toutes les fonctionnalités :</p>
          <div class="feature"><span class="icon">🤖</span><div><strong>Analyse IA des CV</strong> — Extraction intelligente des profils</div></div>
          <div class="feature"><span class="icon">📊</span><div><strong>Classement hybride</strong> — Matching sémantique + compétences + expérience</div></div>
          <div class="feature"><span class="icon">💬</span><div><strong>Assistant RAG</strong> — Interrogez votre base en langage naturel</div></div>
          <div style="text-align: center;">
            <a href="https://nexttalent.ma" class="btn">🚀 Accéder à NextTalent</a>
          </div>
        </div>
        <div class="footer">© 2026 NextTalent · nexttalent.ma</div>
      </div>
    </body>
    </html>
    """

    return send_email(
        to_email=to_email,
        subject="🎉 Bienvenue sur NextTalent !",
        html=html,
    )
