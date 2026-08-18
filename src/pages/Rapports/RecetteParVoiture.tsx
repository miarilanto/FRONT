import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { rapportService } from "../../services/rapportService";

interface RecetteParVoitureData {
  voiture: {
    idvoit: string;
    design: string;
  };

  itineraire: {
    codeit: string;
    villedep: string;
    villearr: string;
  } | null;

  nombreEnvois: number;
  recetteTotale: number;
}

const RecetteParVoiture: React.FC = () => {
  const { idvoit } = useParams<{ idvoit: string }>();

  const [data, setData] = useState<RecetteParVoitureData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idvoit) {
      setError("ID de voiture manquant");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const result = await rapportService.getRecetteParVoiture(idvoit);

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idvoit]);

  // =========================
  // CHARGEMENT
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // =========================
  // ERREUR
  // =========================
  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <span>
          <strong>Erreur :</strong> {error}
        </span>
      </div>
    );
  }

  // =========================
  // AUCUNE DONNÉE
  // =========================
  if (!data) {
    return (
      <div className="alert alert-warning shadow-lg">
        <span>Aucune donnée disponible.</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* =========================
          TITRE
      ========================= */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Recette par voiture</h2>

        <p className="text-base-content/60 mt-1">
          Détails des recettes générées par cette voiture.
        </p>
      </div>

      {/* =========================
          INFORMATIONS VOITURE
      ========================= */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h3 className="card-title">🚗 Informations de la voiture</h3>

          <div className="divider"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID */}
            <div>
              <p className="text-sm text-base-content/60">Identifiant</p>

              <p className="text-xl font-semibold mt-1">
                {data.voiture.idvoit}
              </p>
            </div>

            {/* Design */}
            <div>
              <p className="text-sm text-base-content/60">Désignation</p>

              <p className="text-xl font-semibold mt-1">
                {data.voiture.design}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          ITINÉRAIRE
      ========================= */}
      <div className="card bg-base-100 shadow-xl border border-base-200 mt-6">
        <div className="card-body">
          <h3 className="card-title">🛣️ Itinéraire</h3>

          <div className="divider"></div>

          {data.itineraire ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="badge badge-primary badge-lg">
                  {data.itineraire.codeit}
                </span>

                <span className="text-lg font-medium">
                  {data.itineraire.villedep}
                </span>

                <span className="text-2xl">→</span>

                <span className="text-lg font-medium">
                  {data.itineraire.villearr}
                </span>
              </div>
            </div>
          ) : (
            <div className="alert alert-warning">
              <span>Aucun itinéraire associé à cette voiture.</span>
            </div>
          )}
        </div>
      </div>

      {/* =========================
          STATISTIQUES
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Nombre d'envois */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Nombre d'envois</p>

                <p className="text-4xl font-bold mt-2">{data.nombreEnvois}</p>
              </div>

              <div className="rounded-full bg-primary/10 p-4 text-primary text-2xl">
                📦
              </div>
            </div>

            <div className="mt-4">
              <span className="badge badge-primary">Envois</span>
            </div>
          </div>
        </div>

        {/* Recette totale */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Recette totale</p>

                <p className="text-4xl font-bold mt-2">
                  {data.recetteTotale.toLocaleString("fr-FR")} Ar
                </p>
              </div>

              <div className="rounded-full bg-success/10 p-4 text-success text-2xl">
                💰
              </div>
            </div>

            <div className="mt-4">
              <span className="badge badge-success">Recette</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          RÉSUMÉ
      ========================= */}
      <div className="card bg-base-200 shadow-lg mt-8">
        <div className="card-body">
          <h3 className="card-title">📊 Résumé</h3>

          <p className="text-base-content/70">
            La voiture <strong>{data.voiture.design}</strong> (
            {data.voiture.idvoit}) compte <strong>{data.nombreEnvois}</strong>{" "}
            envoi(s).
          </p>

          <p className="text-base-content/70">
            Elle a généré une recette totale de{" "}
            <strong>{data.recetteTotale.toLocaleString("fr-FR")} Ar</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecetteParVoiture;
