import os
import secrets
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
import pdfplumber
from groq import Groq
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer, util

from database import engine, Base, CandidatModel, OffreModel, UserModel, get_db
from email_service import send_verification_email, send_welcome_email
import bcrypt

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NextTalent API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY manquante dans le fichier .env")

client = Groq(api_key=GROQ_API_KEY)

print("Chargement du modèle d'embeddings...")
model_embed = SentenceTransformer("all-MiniLM-L6-v2")
print("Modèle chargé !")


# ─── Schémas Pydantic ────────────────────────────────────────────────────────

class CVStructure(BaseModel):
    nom_complet: Optional[str] = None
    email: Optional[str] = None
    telephone: Optional[str] = None
    hard_skills: List[str] = []
    soft_skills: List[str] = []
    annees_experience: float = 0.0
    dernier_poste: Optional[str] = None
    langues: List[str] = []

class OffreCreate(BaseModel):
    titre: str
    description: Optional[str] = None
    hard_skills_requis: List[str] = []
    annees_experience_requises: float = 0.0

class ChatQuery(BaseModel):
    question: str

class UserCreate(BaseModel):
    nom: str
    email: str
    password: str
    role: str  # "recruteur" | "candidat"

class UserLogin(BaseModel):
    email: str
    password: str
    role: str


# ─── Auth ────────────────────────────────────────────────────────────────────

@app.post("/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(UserModel).filter(UserModel.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    new_user = UserModel(
        nom=user.nom, email=user.email, password_hash=hashed,
        role=user.role, is_verified=True, verification_token=None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Compte créé avec succès.", "user_id": new_user.id}

@app.get("/auth/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.verification_token == token).first()
    if not user:
        return HTMLResponse(content="""
        <html><body style="font-family:Arial;text-align:center;padding:60px;background:#FEF2F2">
        <h1 style="color:#EF4444">❌ Lien invalide</h1>
        <p>Ce lien de vérification est invalide ou a déjà été utilisé.</p>
        <a href="https://nexttalent.ma" style="color:#4F46E5">Retour à NextTalent</a>
        </body></html>
        """, status_code=400)
    if user.is_verified:
        return HTMLResponse(content="""
        <html><body style="font-family:Arial;text-align:center;padding:60px;background:#F0FDF4">
        <h1 style="color:#10B981">✅ Email déjà vérifié</h1>
        <p>Votre compte est déjà activé.</p>
        <a href="https://nexttalent.ma" style="background:#4F46E5;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px">Se connecter</a>
        </body></html>
        """)
    user.is_verified = True
    user.verification_token = None
    db.commit()
    send_welcome_email(user.email, user.nom)
    return HTMLResponse(content=f"""
    <html><body style="font-family:Arial;text-align:center;padding:60px;background:linear-gradient(135deg,#EEF2FF,#F5F3FF)">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;box-shadow:0 8px 32px rgba(79,70,229,.15)">
    <div style="font-size:56px;margin-bottom:16px">🎉</div>
    <h1 style="color:#4F46E5;font-size:24px">Email confirmé !</h1>
    <p style="color:#6B7280;margin:16px 0">Bonjour <strong>{user.nom}</strong>, votre compte NextTalent est maintenant actif.</p>
    <a href="https://nexttalent.ma" style="background:linear-gradient(135deg,#4F46E5,#7C3AED);color:#fff;padding:14px 36px;border-radius:10px;text-decoration:none;display:inline-block;font-weight:700;margin-top:8px">🚀 Accéder à NextTalent</a>
    </div>
    </body></html>
    """)

@app.post("/auth/resend-verification")
def resend_verification(email: str, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Email non trouvé")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="Email déjà vérifié")
    token = secrets.token_urlsafe(32)
    user.verification_token = token
    db.commit()
    send_verification_email(user.email, user.nom, token)
    return {"message": "Email de vérification renvoyé"}

@app.post("/auth/login")
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == creds.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Email non enregistré")
    if not bcrypt.checkpw(creds.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Mot de passe incorrect")
    if user.role != creds.role:
        raise HTTPException(status_code=401, detail="Rôle non correspondant")
    # Vérification email désactivée temporairement
# if not user.is_verified:
#     raise HTTPException(status_code=403, detail="EMAIL_NOT_VERIFIED")
    if user.is_blocked:
        raise HTTPException(status_code=403, detail="Compte bloqué. Contactez l'administrateur.")
    return {"user_id": user.id, "nom": user.nom, "email": user.email, "role": user.role}


# ─── CV ──────────────────────────────────────────────────────────────────────

@app.post("/extract-cv/", response_model=CVStructure)
async def extract_cv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Seuls les PDF sont acceptés.")

    text_brut = ""
    try:
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                text_brut += page.extract_text() or ""
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lecture PDF : {e}")

    if not text_brut.strip():
        raise HTTPException(status_code=400, detail="PDF vide ou scanné sans texte.")

    prompt = f"""
Tu es un expert RH. Extrais les infos du CV suivant en JSON strict (aucun texte avant/après) :
{{
    "nom_complet": "string ou null",
    "email": "string ou null",
    "telephone": "string ou null",
    "hard_skills": ["liste compétences techniques"],
    "soft_skills": ["liste compétences comportementales"],
    "annees_experience": 0.0,
    "dernier_poste": "string ou null",
    "langues": ["liste langues"]
}}
Si absent → null ou [].

Texte CV :
\"\"\"{text_brut}\"\"\"
"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Extracteur JSON strict. Réponds uniquement en JSON valide."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        data = json.loads(completion.choices[0].message.content)

        # Vérifier doublon par email
        if data.get("email"):
            existing = db.query(CandidatModel).filter(CandidatModel.email == data["email"]).first()
            if existing:
                return data  # Retourner sans recréer

        candidat = CandidatModel(
            nom_complet=data.get("nom_complet"),
            email=data.get("email"),
            telephone=data.get("telephone"),
            hard_skills=", ".join(data.get("hard_skills") or []),
            soft_skills=", ".join(data.get("soft_skills") or []),
            annees_experience=float(data.get("annees_experience") or 0.0),
            dernier_poste=data.get("dernier_poste"),
            langues=", ".join(data.get("langues") or [])
        )
        db.add(candidat)
        db.commit()
        return data

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur IA : {e}")


# ─── Candidats ───────────────────────────────────────────────────────────────

@app.get("/candidats/")
def liste_candidats(db: Session = Depends(get_db)):
    candidats = db.query(CandidatModel).all()
    return [
        {
            "id": c.id,
            "nom_complet": c.nom_complet,
            "email": c.email,
            "telephone": c.telephone,
            "hard_skills": c.hard_skills,
            "soft_skills": c.soft_skills,
            "annees_experience": c.annees_experience,
            "dernier_poste": c.dernier_poste,
            "langues": c.langues,
        }
        for c in candidats
    ]

@app.delete("/candidats/{candidat_id}")
def supprimer_candidat(candidat_id: int, db: Session = Depends(get_db)):
    c = db.query(CandidatModel).filter(CandidatModel.id == candidat_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Candidat introuvable")
    db.delete(c)
    db.commit()
    return {"message": "Candidat supprimé"}


# ─── Offres ──────────────────────────────────────────────────────────────────

@app.post("/offres/")
def creer_offre(offre: OffreCreate, db: Session = Depends(get_db)):
    nouvelle = OffreModel(
        titre=offre.titre,
        description=offre.description,
        hard_skills_requis=", ".join(offre.hard_skills_requis),
        annees_experience_requises=offre.annees_experience_requises
    )
    db.add(nouvelle)
    db.commit()
    db.refresh(nouvelle)
    return {"message": "Offre créée", "offre_id": nouvelle.id}

@app.get("/offres/")
def liste_offres(db: Session = Depends(get_db)):
    offres = db.query(OffreModel).all()
    return [
        {
            "id": o.id,
            "titre": o.titre,
            "description": o.description,
            "hard_skills_requis": o.hard_skills_requis,
            "annees_experience_requises": o.annees_experience_requises,
        }
        for o in offres
    ]

@app.delete("/offres/{offre_id}")
def supprimer_offre(offre_id: int, db: Session = Depends(get_db)):
    o = db.query(OffreModel).filter(OffreModel.id == offre_id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Offre introuvable")
    db.delete(o)
    db.commit()
    return {"message": "Offre supprimée"}


# ─── Ranking ─────────────────────────────────────────────────────────────────

@app.get("/offres/{offre_id}/ranking/")
def rank_candidats(offre_id: int, db: Session = Depends(get_db)):
    offre = db.query(OffreModel).filter(OffreModel.id == offre_id).first()
    if not offre:
        raise HTTPException(status_code=404, detail="Offre introuvable")

    skills_requis = [s.strip().lower() for s in (offre.hard_skills_requis or "").split(",") if s.strip()]
    texte_offre = f"{offre.titre}. {offre.description or ''}. Skills: {offre.hard_skills_requis or ''}"
    emb_offre = model_embed.encode(texte_offre, convert_to_tensor=True)

    candidats = db.query(CandidatModel).all()
    ranking = []

    for c in candidats:
        skills_cand = [s.strip().lower() for s in (c.hard_skills or "").split(",") if s.strip()]
        communs = set(skills_requis).intersection(set(skills_cand))
        score_skills = len(communs) / len(skills_requis) if skills_requis else 0.0

        if offre.annees_experience_requises > 0:
            score_exp = min(c.annees_experience / offre.annees_experience_requises, 1.0)
        else:
            score_exp = 1.0

        texte_cand = f"Poste: {c.dernier_poste or ''}. Skills: {c.hard_skills or ''}"
        emb_cand = model_embed.encode(texte_cand, convert_to_tensor=True)
        score_sem = max(0.0, util.cos_sim(emb_offre, emb_cand).item())

        score_final = (score_sem * 0.40) + (score_skills * 0.40) + (score_exp * 0.20)

        ranking.append({
            "id": c.id,
            "nom_complet": c.nom_complet,
            "email": c.email,
            "dernier_poste": c.dernier_poste,
            "annees_experience": c.annees_experience,
            "hard_skills": c.hard_skills,
            "skills_communs": list(communs),
            "score_semantique": round(score_sem * 100, 1),
            "score_skills": round(score_skills * 100, 1),
            "score_experience": round(score_exp * 100, 1),
            "score_final": round(score_final * 100, 1),
        })

    ranking.sort(key=lambda x: x["score_final"], reverse=True)
    return ranking


# ─── RAG Chat ────────────────────────────────────────────────────────────────

@app.post("/chat-rag/")
def chat_rag(query: ChatQuery, db: Session = Depends(get_db)):
    candidats = db.query(CandidatModel).all()
    if not candidats:
        return {"reponse": "Aucun candidat dans la base de données."}

    emb_question = model_embed.encode(query.question, convert_to_tensor=True)
    pertinents = []

    for c in candidats:
        profil = f"Candidat: {c.nom_complet or 'Inconnu'}. Poste: {c.dernier_poste or 'N/A'}. Skills: {c.hard_skills or ''}. Exp: {c.annees_experience} ans."
        emb_profil = model_embed.encode(profil, convert_to_tensor=True)
        sim = util.cos_sim(emb_question, emb_profil).item()
        if sim > 0.15:
            pertinents.append((sim, profil))

    pertinents.sort(reverse=True)
    contexte = "\n".join(p[1] for p in pertinents[:5]) or "Aucun profil pertinent."

    prompt = f"""Tu es un assistant RH expert de la plateforme NextTalent. Réponds en français, de façon professionnelle et concise.
Utilise UNIQUEMENT les candidats ci-dessous. Ne mentionne que ceux présents dans le contexte.

Candidats disponibles :
\"\"\"
{contexte}
\"\"\"

Question du recruteur : {query.question}"""

    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Assistant RH factuel et rigoureux. Réponds uniquement en français."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.4
        )
        return {"reponse": completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur IA : {e}")


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}


# ─── ADMIN ───────────────────────────────────────────────────────────────────

ADMIN_SECRET = os.getenv("ADMIN_SECRET", "nexttalent-admin-2025")

class AdminLogin(BaseModel):
    email: str
    password: str
    secret: str

class AdminUserUpdate(BaseModel):
    is_blocked: Optional[bool] = None

@app.post("/admin/login")
def admin_login(creds: AdminLogin, db: Session = Depends(get_db)):
    if creds.secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Cle secrete incorrecte")
    user = db.query(UserModel).filter(UserModel.email == creds.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Email non enregistre")
    if not bcrypt.checkpw(creds.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Mot de passe incorrect")
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Acces refuse - role admin requis")
    return {"user_id": user.id, "nom": user.nom, "email": user.email, "role": user.role}

@app.get("/admin/stats")
def admin_stats(secret: str, db: Session = Depends(get_db)):
    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Acces refuse")
    return {
        "total_users":      db.query(UserModel).count(),
        "total_recruteurs": db.query(UserModel).filter(UserModel.role == "recruteur").count(),
        "total_candidats":  db.query(UserModel).filter(UserModel.role == "candidat").count(),
        "total_blocked":    db.query(UserModel).filter(UserModel.is_blocked == True).count(),
        "total_cv":         db.query(CandidatModel).count(),
        "total_offres":     db.query(OffreModel).count(),
    }

@app.get("/admin/users")
def admin_get_users(secret: str, db: Session = Depends(get_db)):
    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Acces refuse")
    users = db.query(UserModel).all()
    return [{"id": u.id, "nom": u.nom, "email": u.email, "role": u.role, "is_blocked": u.is_blocked, "created_at": u.created_at.isoformat() if u.created_at else None} for u in users]

@app.patch("/admin/users/{user_id}")
def admin_update_user(user_id: int, data: AdminUserUpdate, secret: str, db: Session = Depends(get_db)):
    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Acces refuse")
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    if user.role == "admin":
        raise HTTPException(status_code=403, detail="Impossible de modifier un admin")
    if data.is_blocked is not None:
        user.is_blocked = data.is_blocked
    db.commit()
    return {"message": "Utilisateur mis a jour", "is_blocked": user.is_blocked}

@app.delete("/admin/users/{user_id}")
def admin_delete_user(user_id: int, secret: str, db: Session = Depends(get_db)):
    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Acces refuse")
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")
    if user.role == "admin":
        raise HTTPException(status_code=403, detail="Impossible de supprimer un admin")
    db.delete(user)
    db.commit()
    return {"message": "Utilisateur supprime"}

@app.get("/admin/offres")
def admin_get_offres(secret: str, db: Session = Depends(get_db)):
    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Acces refuse")
    offres = db.query(OffreModel).all()
    return [{"id": o.id, "titre": o.titre, "description": o.description, "hard_skills_requis": o.hard_skills_requis, "annees_experience_requises": o.annees_experience_requises, "created_at": o.created_at.isoformat() if o.created_at else None} for o in offres]

@app.delete("/admin/offres/{offre_id}")
def admin_delete_offre(offre_id: int, secret: str, db: Session = Depends(get_db)):
    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Acces refuse")
    o = db.query(OffreModel).filter(OffreModel.id == offre_id).first()
    if not o:
        raise HTTPException(status_code=404, detail="Offre introuvable")
    db.delete(o)
    db.commit()
    return {"message": "Offre supprimee"}

@app.get("/admin/candidats")
def admin_get_candidats(secret: str, db: Session = Depends(get_db)):
    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Acces refuse")
    candidats = db.query(CandidatModel).all()
    return [{"id": c.id, "nom_complet": c.nom_complet, "email": c.email, "dernier_poste": c.dernier_poste, "annees_experience": c.annees_experience, "hard_skills": c.hard_skills, "created_at": c.created_at.isoformat() if c.created_at else None} for c in candidats]

@app.post("/admin/create-admin")
def create_admin_account(user: UserCreate, secret: str, db: Session = Depends(get_db)):
    if secret != ADMIN_SECRET:
        raise HTTPException(status_code=403, detail="Cle secrete incorrecte")
    existing = db.query(UserModel).filter(UserModel.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email deja utilise")
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    new_admin = UserModel(nom=user.nom, email=user.email, password_hash=hashed, role="admin")
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return {"message": "Compte admin cree", "user_id": new_admin.id}
