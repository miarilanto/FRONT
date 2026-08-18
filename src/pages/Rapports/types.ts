// src/components/Rapport/types.ts

export interface RecetteTotale {
  nombreEnvois: number;
  recetteTotale: number;
}

export interface Statistiques {
  totalEnvois: number;
  totalReceptions: number;
  colisEnTransit: number;
  recetteTotale: number;
}

export interface Voiture {
  idvoit: string;
  design: string;
}

export interface Itineraire {
  codeit: string;
  villedep: string;
  villearr: string;
}

export interface RecetteParVoiture {
  voiture: Voiture;
  itineraire: Itineraire | null;
  nombreEnvois: number;
  recetteTotale: number;
}

export interface RecetteParItineraire {
  itineraire: Itineraire;
  nombreVoitures: number;
  nombreEnvois: number;
  recetteTotale: number;
}
