const BASE_URL = "http://localhost:5000/api/rapports";

export const rapportService = {
  // Récupérer la recette totale
  getRecetteTotale: async () => {
    const response = await fetch(`${BASE_URL}/recette`);
    if (!response.ok) {
      throw new Error("Échec de la récupération de la recette totale");
    }
    return response.json();
  },

  // Récupérer les statistiques générales
  getStatistiques: async () => {
    const response = await fetch(`${BASE_URL}/statistiques`);
    if (!response.ok) {
      throw new Error("Échec de la récupération des statistiques");
    }
    return response.json();
  },

  // Récupérer la recette par voiture
  getRecetteParVoiture: async (idvoit: string) => {
    const response = await fetch(`${BASE_URL}/recette/voiture/${idvoit}`);
    if (!response.ok) {
      throw new Error("Voiture introuvable");
    }
    return response.json();
  },

  // Récupérer la recette par itinéraire
  getRecetteParItineraire: async (codeit: string) => {
    const response = await fetch(`${BASE_URL}/recette/itineraire/${codeit}`);
    if (!response.ok) {
      throw new Error("Itinéraire introuvable");
    }
    return response.json();
  },
};
