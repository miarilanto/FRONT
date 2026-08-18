import axios from "axios";
import type { Envoi } from "../types";

const API_URL = "http://localhost:5000/api/envois";

export const envoiService = {
  // ==========================================
  // RÉCUPÉRER LES ENVOIS
  // ==========================================

  getAll: async (): Promise<Envoi[]> => {
    const response = await axios.get<Envoi[]>(API_URL);

    return response.data;
  },

  // ==========================================
  // RÉCUPÉRER UN ENVOI
  // ==========================================

  getById: async (id: number): Promise<Envoi> => {
    const response = await axios.get<Envoi>(`${API_URL}/${id}`);

    return response.data;
  },

  // ==========================================
  // ENVOYER EMAIL DE RÉCEPTION
  // ==========================================

  envoyerEmailReception: async (idenvoi: number) => {
    const response = await axios.post(`${API_URL}/${idenvoi}/email-reception`);

    return response.data;
  },
};
