import React, { useEffect, useState } from "react";
import { rapportService } from "../../services/rapportService";

interface RecetteTotaleData {
  nombreEnvois: number;
  recetteTotale: number;
}

const RecetteTotale: React.FC = () => {
  const [data, setData] = useState<RecetteTotaleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await rapportService.getRecetteTotale();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <span>
          <strong>Erreur :</strong> {error}
        </span>
      </div>
    );
  }

  // Aucune donnée
  if (!data) {
    return (
      <div className="alert alert-warning shadow-lg">
        <span>Aucune donnée disponible.</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Titre */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Recette Totale</h2>

        <p className="text-base-content/60 mt-1">
          Vue générale des recettes générées par les envois.
        </p>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre d'envois */}
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Nombre d'envois</p>

                <p className="text-4xl font-bold mt-2">{data.nombreEnvois}</p>
              </div>

              <div className="bg-primary/10 text-primary rounded-full p-4">
                📦
              </div>
            </div>

            <div className="card-actions justify-end mt-4">
              <div className="badge badge-primary">Envois</div>
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

              <div className="bg-success/10 text-success rounded-full p-4">
                💰
              </div>
            </div>

            <div className="card-actions justify-end mt-4">
              <div className="badge badge-success">Recette</div>
            </div>
          </div>
        </div>
      </div>

      {/* Résumé */}
      <div className="card bg-base-200 mt-6">
        <div className="card-body">
          <h3 className="card-title">Résumé</h3>

          <p>
            Le système compte actuellement <strong>{data.nombreEnvois}</strong>{" "}
            envoi(s), pour une recette totale de{" "}
            <strong>{data.recetteTotale.toLocaleString("fr-FR")} Ar</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecetteTotale;
