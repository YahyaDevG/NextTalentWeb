const BASE = process.env.REACT_APP_API_URL || '';

async function request(method, path, body, isForm = false) {
  const opts = {
    method,
    headers: isForm ? {} : { 'Content-Type': 'application/json' },
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  };
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || `Erreur ${res.status}`);
  return data;
}

export const api = {
  // Auth
  register: (payload)        => request('POST', '/auth/register', payload),
  login:    (payload)        => request('POST', '/auth/login',    payload),

  // CV
  extractCV: (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('POST', '/extract-cv/', form, true);
  },

  // Candidats
  getCandidats: ()   => request('GET',    '/candidats/'),
  deleteCandidat: (id) => request('DELETE', `/candidats/${id}`),

  // Offres
  getOffres:    ()      => request('GET',    '/offres/'),
  createOffre:  (data)  => request('POST',   '/offres/', data),
  deleteOffre:  (id)    => request('DELETE', `/offres/${id}`),

  // Ranking
  getRanking: (offreId) => request('GET', `/offres/${offreId}/ranking/`),

  // Chat RAG
  chat: (question) => request('POST', '/chat-rag/', { question }),
};
