// ==========================================
// URL API
// ==========================================

const API_URL = "http://localhost:5000/api/dashboard";

// ==========================================
// RÉCUPÉRER LE DASHBOARD
// GET /api/dashboard
// ==========================================

export const getDashboard = async (params = {}) => {
  const searchParams = new URLSearchParams();

  // ==========================================
  // PÉRIODE
  // ==========================================

  if (params.periode) {
    searchParams.append("periode", params.periode);
  }

  // ==========================================
  // ITINÉRAIRE
  // ==========================================

  if (params.codeit) {
    searchParams.append("codeit", params.codeit);
  }

  // ==========================================
  // VOITURE
  // ==========================================

  if (params.idvoit) {
    searchParams.append("idvoit", params.idvoit);
  }

  // ==========================================
  // CONSTRUIRE L'URL
  // ==========================================

  const queryString = searchParams.toString();

  const url = queryString ? `${API_URL}?${queryString}` : API_URL;

  // ==========================================
  // REQUÊTE API
  // ==========================================

  const response = await fetch(url);

  // ==========================================
  // VÉRIFIER LA RÉPONSE HTTP
  // ==========================================

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(
      error?.message || "Erreur lors de la récupération du dashboard",
    );
  }

  // ==========================================
  // RÉCUPÉRER LA RÉPONSE
  // ==========================================

  const result = await response.json();

  // ==========================================
  // VÉRIFIER SUCCESS
  // ==========================================

  if (!result.success) {
    throw new Error(
      result.message || "Erreur lors de la récupération du dashboard",
    );
  }

  // ==========================================
  // RETOURNER LES DONNÉES
  // ==========================================

  return result.data;
};
