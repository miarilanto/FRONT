import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { rapportService } from "../../services/rapportService";

interface RecetteParItineraireData {
  itineraire: {
    codeit: string;
    villedep: string;
    villearr: string;
  };

  nombreVoitures: number;
  nombreEnvois: number;
  recetteTotale: number;
}

const RecetteParItineraire: React.FC = () => {
  const { codeit } = useParams<{ codeit: string }>();

  const [data, setData] = useState<RecetteParItineraireData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!codeit) {
      setError("Code itinéraire manquant");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const result = await rapportService.getRecetteParItineraire(codeit);

        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codeit]);

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
        <h2 className="text-2xl font-bold">Recette par itinéraire</h2>

        <p className="text-base-content/60 mt-1">
          Détails des recettes générées pour cet itinéraire.
        </p>
      </div>

      {/* =========================
          INFORMATIONS ITINÉRAIRE
      ========================= */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h3 className="card-title">🛣️ Informations de l'itinéraire</h3>

          <div className="divider"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Code */}
            <div>
              <p className="text-sm text-base-content/60">Code itinéraire</p>

              <div className="mt-2">
                <span className="badge badge-primary badge-lg">
                  {data.itineraire.codeit}
                </span>
              </div>
            </div>

            {/* Départ */}
            <div>
              <p className="text-sm text-base-content/60">Ville de départ</p>

              <p className="text-xl font-semibold mt-2">
                {data.itineraire.villedep}
              </p>
            </div>

            {/* Arrivée */}
            <div>
              <p className="text-sm text-base-content/60">Ville d'arrivée</p>

              <p className="text-xl font-semibold mt-2">
                {data.itineraire.villearr}
              </p>
            </div>
          </div>

          {/* Trajet */}
          <div className="mt-6">
            <div className="alert alert-info">
              <span className="text-lg font-medium">
                📍 {data.itineraire.villedep}
                <span className="mx-3">→</span>
                {data.itineraire.villearr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================
          STATISTIQUES
      ========================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Nombre de voitures */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">
                  Nombre de voitures
                </p>

                <p className="text-4xl font-bold mt-2">{data.nombreVoitures}</p>
              </div>

              <div className="rounded-full bg-info/10 p-4 text-info text-2xl">
                🚗
              </div>
            </div>

            <div className="mt-4">
              <span className="badge badge-info">Voitures</span>
            </div>
          </div>
        </div>

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
            L'itinéraire <strong>{data.itineraire.codeit}</strong> relie{" "}
            <strong>{data.itineraire.villedep}</strong> à{" "}
            <strong>{data.itineraire.villearr}</strong>.
          </p>

          <p className="text-base-content/70">
            Il est desservi par <strong>{data.nombreVoitures}</strong>{" "}
            voiture(s) et compte <strong>{data.nombreEnvois}</strong> envoi(s).
          </p>

          <p className="text-base-content/70">
            La recette totale est de{" "}
            <strong>{data.recetteTotale.toLocaleString("fr-FR")} Ar</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecetteParItineraire;
