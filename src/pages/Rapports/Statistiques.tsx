import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { rapportService } from "../../services/rapportService";

interface StatistiquesData {
  totalEnvois: number;
  totalReceptions: number;
  colisEnTransit: number;
  recetteTotale: number;
}

const Statistiques: React.FC = () => {
  const [data, setData] = useState<StatistiquesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await rapportService.getStatistiques();

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur inconnue"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==========================================
  // CHARGEMENT
  // ==========================================

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ==========================================
  // ERREUR
  // ==========================================

  if (error) {
    return (
      <div className="alert alert-error shadow-lg">
        <span>
          <strong>Erreur :</strong> {error}
        </span>
      </div>
    );
  }

  // ==========================================
  // AUCUNE DONNÉE
  // ==========================================

  if (!data) {
    return (
      <div className="alert alert-warning shadow-lg">
        <span>Aucune donnée disponible.</span>
      </div>
    );
  }

  // ==========================================
  // DONNÉES GRAPHIQUE BARRES
  // ==========================================

  const barData = [
    {
      nom: "Envois",
      nombre: data.totalEnvois,
    },
    {
      nom: "Réceptions",
      nombre: data.totalReceptions,
    },
    {
      nom: "En transit",
      nombre: data.colisEnTransit,
    },
  ];

  // ==========================================
  // DONNÉES GRAPHIQUE CIRCULAIRE
  // ==========================================

  const pieData = [
    {
      name: "Réceptions",
      value: data.totalReceptions,
    },
    {
      name: "En transit",
      value: data.colisEnTransit,
    },
  ];

  // ==========================================
  // INTERFACE
  // ==========================================

  return (
    <div className="w-full px-6 pb-6 pt-0 overflow-x-hidden">

      {/* ==========================================
          EN-TÊTE
      ========================================== */}

      <div className="mb-6 mt-0">
        <h2 className="text-2xl font-bold">
          Statistiques générales
        </h2>

        <p className="text-base-content/60 mt-1">
          Vue globale de l'activité des envois et des recettes.
        </p>
      </div>

      {/* ==========================================
          CARTES STATISTIQUES
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* TOTAL ENVOIS */}

        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-base-content/60">
                  Total envois
                </p>

                <p className="text-3xl font-bold mt-2">
                  {data.totalEnvois}
                </p>
              </div>

              <div className="rounded-full bg-primary/10 p-4 text-primary text-2xl">
                📦
              </div>

            </div>

            <div className="mt-4">
              <span className="badge badge-primary">
                Envois
              </span>
            </div>

          </div>
        </div>

        {/* TOTAL RÉCEPTIONS */}

        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-base-content/60">
                  Total réceptions
                </p>

                <p className="text-3xl font-bold mt-2">
                  {data.totalReceptions}
                </p>
              </div>

              <div className="rounded-full bg-info/10 p-4 text-info text-2xl">
                📥
              </div>

            </div>

            <div className="mt-4">
              <span className="badge badge-info">
                Réceptions
              </span>
            </div>

          </div>
        </div>

        {/* COLIS EN TRANSIT */}

        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-base-content/60">
                  Colis en transit
                </p>

                <p className="text-3xl font-bold mt-2">
                  {data.colisEnTransit}
                </p>
              </div>

              <div className="rounded-full bg-warning/10 p-4 text-warning text-2xl">
                🚚
              </div>

            </div>

            <div className="mt-4">
              <span className="badge badge-warning">
                En transit
              </span>
            </div>

          </div>
        </div>

        {/* RECETTE TOTALE */}

        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-base-content/60">
                  Recette totale
                </p>

                <p className="text-3xl font-bold mt-2">
                  {data.recetteTotale.toLocaleString("fr-FR")} Ar
                </p>
              </div>

              <div className="rounded-full bg-success/10 p-4 text-success text-2xl">
                💰
              </div>

            </div>

            <div className="mt-4">
              <span className="badge badge-success">
                Recette
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* ==========================================
          GRAPHIQUES
      ========================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* ==========================================
            GRAPHIQUE EN BARRES
        ========================================== */}

        <div className="card bg-base-100 shadow-xl border border-base-200">

          <div className="card-body">

            <h3 className="card-title">
              Activité des colis
            </h3>

            <p className="text-sm text-base-content/60">
              Comparaison des envois, réceptions et colis en transit.
            </p>

            <div className="w-full h-80 mt-6 overflow-hidden">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart data={barData}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="nom" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="nombre"
                    fill="currentColor"
                    className="text-primary"
                    radius={[8, 8, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* ==========================================
            GRAPHIQUE CIRCULAIRE
        ========================================== */}

        <div className="card bg-base-100 shadow-xl border border-base-200">

          <div className="card-body">

            <h3 className="card-title">
              État des colis
            </h3>

            <p className="text-sm text-base-content/60">
              Répartition entre les colis réceptionnés et ceux en transit.
            </p>

            <div className="w-full h-80 mt-6 overflow-hidden">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    dataKey="value"
                  >

                    <Cell className="fill-info" />

                    <Cell className="fill-warning" />

                  </Pie>

                  <Tooltip />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          RECETTE TOTALE
      ========================================== */}

      <div className="card bg-base-100 shadow-xl border border-base-200 mt-8">

        <div className="card-body">

          <h3 className="card-title">
            💰 Recette totale
          </h3>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-sm text-base-content/60">
                Montant total généré par les envois
              </p>

              <p className="text-4xl font-bold text-success mt-2">
                {data.recetteTotale.toLocaleString("fr-FR")} Ar
              </p>

            </div>

            <div className="badge badge-success badge-lg">
              Recette
            </div>

          </div>

        </div>

      </div>

      {/* ==========================================
          RÉSUMÉ
      ========================================== */}

      <div className="card bg-base-200 shadow-lg mt-8">

        <div className="card-body">

          <h3 className="card-title">
            Résumé de l'activité
          </h3>

          <p className="text-base-content/70">

            Le système compte{" "}
            <strong>
              {data.totalEnvois}
            </strong>{" "}
            envoi(s), dont{" "}
            <strong>
              {data.totalReceptions}
            </strong>{" "}
            réception(s) effectuée(s).

          </p>

          <p className="text-base-content/70">

            <strong>
              {data.colisEnTransit}
            </strong>{" "}
            colis sont actuellement en transit pour une recette totale de{" "}

            <strong>
              {data.recetteTotale.toLocaleString("fr-FR")} Ar
            </strong>.

          </p>

        </div>

      </div>

    </div>
  );
};

export default Statistiques;