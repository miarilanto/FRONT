export interface Envoi {
  idenvoi: number;
  idvoit: number;
  colis: string;

  nomEnvoyeur: string;
  emailEnvoyeur: string;

  date_envoi: string;
  frais: number;

  nomRecepteur: string;
  contactRecepteur: string;

  voiture?: {
    idvoit: number;
    design: string;

    itineraire?: {
      villedep: string;
      villearr: string;
    };
  };

  reception?: {
    idreception?: number;
    date_recept: string;
  } | null;
}
