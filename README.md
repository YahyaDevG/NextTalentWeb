# 💼 NextTalent v2.0 — Guide de déploiement complet

Plateforme intelligente de recrutement IA · FastAPI + React + LLaMA 3.1

---

## Structure du projet

```
nexttalent-web/
├── backend/
│   ├── main.py              ← API FastAPI (tous les endpoints)
│   ├── database.py          ← SQLAlchemy (SQLite dev / PostgreSQL prod)
│   ├── requirements.txt     ← Dépendances Python
│   ├── render.yaml          ← Config déploiement Render
│   └── .env.example         ← Variables d'environnement
│
└── frontend/
    ├── public/index.html
    ├── src/
    │   ├── App.js           ← Routeur principal
    │   ├── api.js           ← Tous les appels API
    │   ├── index.js / index.css
    │   ├── components/
    │   │   ├── ui.js        ← Composants réutilisables
    │   │   └── Shell.js     ← Layout sidebar + topbar
    │   └── pages/
    │       ├── AuthPage.js      ← Login / Register
    │       ├── RecruteurApp.js  ← Dashboard, CV, Offres, Ranking, Chat
    │       └── CandidatApp.js   ← Accueil, Postuler, Candidatures, Profil
    ├── package.json
    └── .env.example
```

---

## ÉTAPE 1 — Tester en local (5 minutes)

### Backend

```bash
cd backend

# 1. Créer l'environnement Python
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditez .env et ajoutez votre clé Groq (https://console.groq.com → API Keys)
# GROQ_API_KEY=votre_cle_ici

# 4. Démarrer le backend
uvicorn main:app --reload --port 8000

# ✅ API disponible sur http://localhost:8000
# ✅ Docs Swagger sur http://localhost:8000/docs
```

### Frontend

```bash
cd frontend

# 1. Installer les dépendances Node
npm install

# 2. Démarrer le frontend (dans un 2e terminal)
npm start

# ✅ Application disponible sur http://localhost:3000
```

> Le `"proxy": "http://localhost:8000"` dans package.json redirige automatiquement
> les appels API vers le backend en développement.

---

## ÉTAPE 2 — Déployer le Backend sur Render.com (gratuit)

### 2.1 — Préparer le repo GitHub

```bash
# Depuis la racine nexttalent-web/
git init
git add .
git commit -m "NextTalent v2.0 — initial commit"
git remote add origin https://github.com/VOTRE_USERNAME/nexttalent-web.git
git push -u origin main
```

### 2.2 — Créer le service sur Render

1. Allez sur [render.com](https://render.com) → "New +" → **Web Service**
2. Connectez votre repo GitHub `nexttalent-web`
3. Configurez :
   - **Root Directory** : `backend`
   - **Environment** : `Python 3`
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Variables d'environnement** → Add :
   - `GROQ_API_KEY` = votre clé Groq

### 2.3 — Ajouter la base PostgreSQL (optionnel mais recommandé)

1. "New +" → **PostgreSQL** → Nommez-la `nexttalent-db`
2. Dans votre Web Service → Environment → Add :
   - `DATABASE_URL` = coller la "Internal Database URL" de PostgreSQL

> Sans PostgreSQL, l'app utilise SQLite (données perdues au redémarrage sur Render free tier).

### 2.4 — Récupérer l'URL du backend

Après déploiement : `https://nexttalent-backend-xxxx.onrender.com`

---

## ÉTAPE 3 — Déployer le Frontend sur Vercel (gratuit)

### 3.1 — Configurer l'URL du backend

```bash
cd frontend
cp .env.example .env
# Éditez .env :
# REACT_APP_API_URL=https://nexttalent-backend-xxxx.onrender.com
```

### 3.2 — Option A : Via CLI Vercel

```bash
npm install -g vercel
cd frontend
vercel --prod

# Lors de la configuration :
# - Root directory : frontend
# - Build command  : npm run build
# - Output dir     : build
```

### 3.3 — Option B : Via dashboard Vercel

1. Allez sur [vercel.com](https://vercel.com) → "New Project"
2. Importez votre repo GitHub
3. **Root Directory** : `frontend`
4. **Environment Variables** → Add :
   - `REACT_APP_API_URL` = `https://votre-backend.onrender.com`
5. Cliquez **Deploy**

### 3.4 — Résultat

✅ Votre app est en ligne sur `https://nexttalent-xxxx.vercel.app`

---

## ÉTAPE 4 — Configurer CORS (si erreur de connexion)

Si le frontend ne peut pas appeler le backend, éditez `backend/main.py` :

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://nexttalent-xxxx.vercel.app",  # ← Votre URL Vercel
        "http://localhost:3000",               # Dev local
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Comptes de démo (à créer via /auth/register)

| Rôle       | Email                  | Mot de passe |
|------------|------------------------|--------------|
| Recruteur  | recruteur@test.com     | 123          |
| Candidat   | candidat@test.com      | 123          |

> Créez ces comptes en premier via la page "S'inscrire" ou l'endpoint `/auth/register`.

---

## Fonctionnalités de l'application

### 🏢 Espace Recruteur
- **Dashboard** : KPIs, candidats récents, offres actives
- **Import CV** : Upload PDF → extraction NER (LLaMA 3.1) → stockage DB
- **Offres** : Créer/supprimer des offres avec compétences et expérience requises
- **Classement IA** : Scoring hybride sémantique (40%) + skills (40%) + expérience (20%)
- **Assistant RAG** : Chat en langage naturel sur la base de candidats

### 👤 Espace Candidat
- **Accueil** : Vue d'ensemble et offres recommandées
- **Postuler** : Sélectionner une offre + upload CV avec analyse IA en temps réel
- **Mes candidatures** : Historique avec statuts et scores
- **Profil** : Édition des informations personnelles

---

## Technologies utilisées

| Couche    | Technologie                   |
|-----------|-------------------------------|
| Backend   | FastAPI, Python 3.11          |
| IA / NER  | Groq (LLaMA 3.1-8b-instant)  |
| Embeddings| SentenceTransformers (MiniLM) |
| PDF       | pdfplumber                    |
| DB Dev    | SQLite                        |
| DB Prod   | PostgreSQL (Render)           |
| Auth      | bcrypt (hash des mots de passe)|
| Frontend  | React 18, CSS pur             |
| Typo      | Space Grotesk + Inter         |
| Icons     | Tabler Icons                  |
| Deploy    | Render (backend) + Vercel (frontend) |

---

## Support

Problème ? Vérifiez :
1. `http://localhost:8000/health` → `{"status": "ok"}` ✅
2. `http://localhost:8000/docs` → Swagger UI ✅
3. La variable `GROQ_API_KEY` est bien définie dans `.env`
4. Les logs Render pour les erreurs de démarrage
