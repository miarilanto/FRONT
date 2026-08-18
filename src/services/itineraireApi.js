const API_URL = "http://localhost:5000/api/itineraires";

// ==========================================
// RÉCUPÉRER TOUS LES ITINÉRAIRES
// GET /api/itineraires
// ==========================================

export const getAllItineraires = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des itinéraires");
  }

  return await response.json();
};

// ==========================================
// RECHERCHER UN ITINÉRAIRE
// GET /api/itineraires/recherche?q=...
// ==========================================

export const rechercherItineraire = async (q) => {
  if (!q || q.trim() === "") {
    throw new Error("Le terme de recherche est obligatoire");
  }

  const response = await fetch(
    `${API_URL}/recherche?q=${encodeURIComponent(q.trim())}`,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.message || "Erreur lors de la recherche");
  }

  return await response.json();
};

// ==========================================
// RÉCUPÉRER UN ITINÉRAIRE PAR CODE
// GET /api/itineraires/:codeit
// ==========================================

export const getItineraireById = async (codeit) => {
  const response = await fetch(`${API_URL}/${encodeURIComponent(codeit)}`);

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.message || "Itinéraire introuvable");
  }

  return await response.json();
};

// ==========================================
// CRÉER UN ITINÉRAIRE
// POST /api/itineraires
// ==========================================

export const createItineraire = async ({ codeit, villedep, villearr }) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      codeit,
      villedep,
      villearr,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || "Erreur lors de la création de l'itinéraire",
    );
  }

  return await response.json();
};

// ==========================================
// MODIFIER UN ITINÉRAIRE
// PUT /api/itineraires/:codeit
// ==========================================

export const updateItineraire = async (codeit, { villedep, villearr }) => {
  const response = await fetch(`${API_URL}/${encodeURIComponent(codeit)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      villedep,
      villearr,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || "Erreur lors de la modification de l'itinéraire",
    );
  }

  return await response.json();
};

// ==========================================
// SUPPRIMER UN ITINÉRAIRE
// DELETE /api/itineraires/:codeit
// ==========================================

export const deleteItineraire = async (codeit) => {
  const response = await fetch(`${API_URL}/${encodeURIComponent(codeit)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || "Erreur lors de la suppression de l'itinéraire",
    );
  }

  return await response.json();
};

// ==========================================
// RÉCUPÉRER UN ITINÉRAIRE AVEC SES VOITURES
// GET /api/itineraires/:codeit/voitures
// ==========================================

export const getItineraireWithVoitures = async (codeit) => {
  const response = await fetch(
    `${API_URL}/${encodeURIComponent(codeit)}/voitures`,
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || "Erreur lors de la récupération des voitures",
    );
  }

  return await response.json();
};
