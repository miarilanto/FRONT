const API_URL = "http://localhost:5000/api/voitures";

// ==========================================
// RÉCUPÉRER TOUTES LES VOITURES
// GET /api/voitures
// ==========================================

export const getVoitures = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des voitures");
  }

  return await response.json();
};

// ==========================================
// RÉCUPÉRER UNE VOITURE
// GET /api/voitures/:id
// ==========================================

export const getVoitureById = async (idvoit) => {
  const response = await fetch(`${API_URL}/${idvoit}`);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la voiture");
  }

  return await response.json();
};

// ==========================================
// RECHERCHER DES VOITURES
// GET /api/voitures/recherche?q=...
// ==========================================

export const rechercherVoitures = async (q) => {
  const response = await fetch(
    `${API_URL}/recherche?q=${encodeURIComponent(q)}`
  );

  if (!response.ok) {
    throw new Error("Erreur lors de la recherche des voitures");
  }

  return await response.json();
};

// ==========================================
// CRÉER UNE VOITURE
// POST /api/voitures
// ==========================================

export const createVoiture = async (voiture) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(voiture),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la création de la voiture");
  }

  return await response.json();
};

// ==========================================
// MODIFIER UNE VOITURE
// PUT /api/voitures/:id
// ==========================================

export const updateVoiture = async (idvoit, voiture) => {
  const response = await fetch(`${API_URL}/${idvoit}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(voiture),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la modification de la voiture");
  }

  return await response.json();
};

// ==========================================
// SUPPRIMER UNE VOITURE
// DELETE /api/voitures/:id
// ==========================================

export const deleteVoiture = async (idvoit) => {
  const response = await fetch(`${API_URL}/${idvoit}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de la voiture");
  }

  return await response.json();
};