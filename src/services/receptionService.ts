import type { Reception, ReceptionFormData } from "../pages/Receptions/types";

const BASE_URL = "http://localhost:5000/api/receptions";

export const receptionService = {
  // ==============================
  // Toutes les réceptions
  // ==============================
  getAll: async (): Promise<Reception[]> => {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error("Impossible de récupérer les réceptions");
    }

    return response.json();
  },

  // ==============================
  // Une réception
  // ==============================
  getById: async (id: number): Promise<Reception> => {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Réception introuvable");
    }

    return response.json();
  },

  // ==============================
  // Recherche
  // ==============================
  rechercher: async (q: string): Promise<Reception[]> => {
    const response = await fetch(
      `${BASE_URL}/recherche?q=${encodeURIComponent(q)}`,
    );

    if (!response.ok) {
      throw new Error("Erreur lors de la recherche");
    }

    return response.json();
  },

  // ==============================
  // Créer
  // ==============================
  create: async (data: ReceptionFormData): Promise<Reception> => {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(error?.message || "Erreur lors de la création");
    }

    return response.json();
  },

  // ==============================
  // Modifier
  // ==============================
  update: async (id: number, data: ReceptionFormData): Promise<Reception> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(error?.message || "Erreur lors de la modification");
    }

    return response.json();
  },

  // ==============================
  // Supprimer
  // ==============================
  remove: async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(error?.message || "Erreur lors de la suppression");
    }
  },
};
