const API_URL = "http://localhost:5000/api/envois";

// ==========================================
// RÉCUPÉRER TOUS LES ENVOIS
// GET /api/envois
// ==========================================

export const getEnvois = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des envois");
  }

  return await response.json();
};

// ==========================================
// RÉCUPÉRER UN ENVOI
// GET /api/envois/:id
// ==========================================

export const getEnvoiById = async (idenvoi) => {
  const response = await fetch(`${API_URL}/${idenvoi}`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'envoi");
  }

  return await response.json();
};

// ==========================================
// RECHERCHER DES ENVOIS
// GET /api/envois/recherche?q=...
// ==========================================

export const rechercherEnvois = async (q) => {
  const response = await fetch(
    `${API_URL}/recherche?q=${encodeURIComponent(q)}`
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la recherche des envois");
  }

  return await response.json();
};

// ==========================================
// CRÉER UN ENVOI
// POST /api/envois
// ==========================================

export const createEnvoi = async (envoi) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(envoi),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de l'envoi");
  }

  return await response.json();
};

// ==========================================
// MODIFIER UN ENVOI
// PUT /api/envois/:id
// ==========================================

export const updateEnvoi = async (idenvoi, envoi) => {
  const response = await fetch(`${API_URL}/${idenvoi}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(envoi),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la modification de l'envoi");
  }

  return await response.json();
};

// ==========================================
// SUPPRIMER UN ENVOI
// DELETE /api/envois/:id
// ==========================================

export const deleteEnvoi = async (idenvoi) => {
  const response = await fetch(`${API_URL}/${idenvoi}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de l'envoi");
  }

  return await response.json();
};