import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

SMTP_HOST     = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER     = os.getenv("SMTP_USER", "yahyaerrah@gmail.com")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
FRONTEND_URL  = os.getenv("FRONTEND_URL", "https://nexttalent.ma")


def send_verification_email(to_email: str, nom: str, token: str) -> bool:
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
          © 2026 NextTalent · nexttalent.ma · Email envoyé automatiquement, merci de ne pas répondre.
        </div>
      </div>
    </body>
    </html>
    """

    text = f"""
    Bonjour {nom},
    Merci de vous être inscrit sur NextTalent !
    Cliquez sur ce lien pour confirmer votre email :
    {verify_url}
    Ce lien est valable 24 heures.
    """

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "✅ Confirmez votre email — NextTalent"
        msg["From"]    = f"NextTalent <{SMTP_USER}>"
        msg["To"]      = to_email
        msg.attach(MIMEText(text, "plain", "utf-8"))
        msg.attach(MIMEText(html, "html", "utf-8"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, to_email, msg.as_string())

        print(f"✅ Email envoyé à {to_email}")
        return True
    except Exception as e:
        print(f"❌ Erreur envoi email : {e}")
        return False


def send_welcome_email(to_email: str, nom: str) -> bool:
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
          <p class="text">Votre compte a été activé avec succès. Vous pouvez maintenant accéder à toutes les fonctionnalités :</p>
          <div class="feature"><span class="icon">🤖</span><div><strong>Analyse IA des CV</strong> — Import automatique et extraction intelligente des profils</div></div>
          <div class="feature"><span class="icon">📊</span><div><strong>Classement hybride</strong> — Matching sémantique + compétences + expérience</div></div>
          <div class="feature"><span class="icon">💬</span><div><strong>Assistant RAG</strong> — Interrogez votre base de candidats en langage naturel</div></div>
          <div style="text-align: center;">
            <a href="https://nexttalent.ma" class="btn">🚀 Accéder à NextTalent</a>
          </div>
        </div>
        <div class="footer">© 2026 NextTalent · nexttalent.ma</div>
      </div>
    </body>
    </html>
    """

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "🎉 Bienvenue sur NextTalent !"
        msg["From"]    = f"NextTalent <{SMTP_USER}>"
        msg["To"]      = to_email
        msg.attach(MIMEText(html, "html", "utf-8"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_USER, to_email, msg.as_string())

        print(f"✅ Email bienvenue envoyé à {to_email}")
        return True
    except Exception as e:
        print(f"❌ Erreur envoi email bienvenue : {e}")
        return False
