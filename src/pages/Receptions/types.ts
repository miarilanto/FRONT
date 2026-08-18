export interface Itineraire {
  codeit: string;
  villedep: string;
  villearr: string;
}

export interface Voiture {
  idvoit: string;
  design: string;
  itineraire?: Itineraire | null;
}

export interface Envoyer {
  idenvoi: number;
  colis: string;
  nomEnvoyeur: string;
  nomRecepteur: string;
  contactRecepteur: string;
  idvoit: string;
  voiture?: Voiture | null;
}

export interface Reception {
  idrecept: number;
  idenvoi: number;
  date_recept: string;
  envoyer?: Envoyer | null;
}

export interface ReceptionFormData {
  idenvoi: number;
  date_recept: string;
}
