import os
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pdfplumber
from groq import Groq
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sentence_transformers import SentenceTransformer, util

from database import engine, Base, CandidatModel, OffreModel, UserModel, get_db
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
    new_user = UserModel(nom=user.nom, email=user.email, password_hash=hashed, role=user.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Compte créé", "user_id": new_user.id, "nom": new_user.nom, "role": new_user.role}

@app.post("/auth/login")
def login(creds: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == creds.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Email non enregistré")
    if not bcrypt.checkpw(creds.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Mot de passe incorrect")
    if user.role != creds.role:
        raise HTTPException(status_code=401, detail="Rôle non correspondant")
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
