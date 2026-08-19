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
import {
  BarChart3,
  Package,
  PackageCheck,
  Truck,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Coins,
  PieChart as PieIcon,
} from "lucide-react";

import { rapportService } from "../../services/rapportService";

// ======================================================
// INTERFACE
// ======================================================

interface StatistiquesData {
  totalEnvois: number;
  totalReceptions: number;
  colisEnTransit: number;
  recetteTotale: number;
}

// Couleurs harmonieuses pour le graphique circulaire
const PIE_COLORS = ["#10b981", "#f59e0b"]; // Émeraude (Réceptions), Ambre (En transit)

// ======================================================
// COMPOSANT PRINCIPAL
// ======================================================

const Statistiques: React.FC = () => {
  const [data, setData] = useState<StatistiquesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ======================================================
  // CHARGER LES STATISTIQUES
  // ======================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await rapportService.getStatistiques();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des statistiques.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ======================================================
  // ÉTAT DE CHARGEMENT
  // ======================================================

  if (loading) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Calcul des statistiques générales...
        </p>
      </div>
    );
  }

  // ======================================================
  // ÉTAT D'ERREUR
  // ======================================================

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-xs">
        <AlertTriangle className="h-6 w-6 shrink-0 text-red-500" />
        <div>
          <h4 className="text-sm font-bold">Erreur de chargement</h4>
          <p className="text-xs text-red-600 mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  // ======================================================
  // AUCUNE DONNÉE
  // ======================================================

  if (!data) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800 shadow-xs">
        <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
        <span className="text-sm font-medium">
          Aucune donnée statistique disponible pour le moment.
        </span>
      </div>
    );
  }

  // ======================================================
  // DONNÉES DES GRAPHIQUES
  // ======================================================

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

  const pieData = [
    {
      name: "Réceptions effectuées",
      value: data.totalReceptions,
    },
    {
      name: "Colis en transit",
      value: data.colisEnTransit,
    },
  ];

  return (
    <div className="space-y-6">
      {/* ==================================================
          1. HEADER (BANNIÈRE MODERNE)
      ================================================== */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <BarChart3 className="h-6 w-6" strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Statistiques générales
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Vue globale de l'activité des envois, des réceptions et des flux
              financiers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Métriques consolidées
          </span>
        </div>
      </div>

      {/* ==================================================
          2. CARTES STATISTIQUES (4 KPI CARDS)
      ================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TOTAL ENVOIS */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total envois
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-slate-900">
            {data.totalEnvois}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            Colis expédiés
          </span>
        </div>

        {/* TOTAL RÉCEPTIONS */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total réceptions
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <PackageCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-blue-600">
            {data.totalReceptions}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            Colis réceptionnés
          </span>
        </div>

        {/* COLIS EN TRANSIT */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Colis en transit
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-amber-600">
            {data.colisEnTransit}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            En cours d'acheminement
          </span>
        </div>

        {/* RECETTE TOTALE */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recette totale
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl font-black text-emerald-600">
            {data.recetteTotale.toLocaleString("fr-FR")} Ar
          </p>
          <span className="mt-1 block text-xs font-medium text-emerald-700/80">
            Revenus globaux générés
          </span>
        </div>
      </div>

      {/* ==================================================
          3. GRAPHIQUES (BARRES & CAMEMBERT)
      ================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* GRAPHIQUE EN BARRES */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Activité des colis
              </h3>
              <p className="text-xs text-slate-400">
                Comparatif des volumes : envois, réceptions et transits
              </p>
            </div>
          </div>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="nom"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                />
                <Tooltip
                  formatter={(val: any) => [`${val} colis`, "Nombre"]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar
                  dataKey="nombre"
                  fill="#4f46e5"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={55}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* GRAPHIQUE CIRCULAIRE */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <PieIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                État d'avancement des flux
              </h3>
              <p className="text-xs text-slate-400">
                Répartition des colis réceptionnés vs en cours d'acheminement
              </p>
            </div>
          </div>

          <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                  }
                  labelLine={false}
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${val} colis`, "Quantité"]}
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  wrapperStyle={{ paddingTop: "12px", fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ==================================================
          4. BILAN FINANCIER & RÉSUMÉ
      ================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold">
              Synthèse globale de l'activité
            </h3>
            <p className="text-xs text-slate-400">
              Résumé consolidé des flux logistiques
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-600">
          <p className="leading-relaxed">
            Le réseau enregistre actuellement un total de{" "}
            <strong className="font-semibold text-slate-900">
              {data.totalEnvois} envois
            </strong>
            , dont{" "}
            <strong className="font-semibold text-emerald-600">
              {data.totalReceptions} réceptions
            </strong>{" "}
            menées à terme avec succès.
          </p>

          <p className="leading-relaxed">
            Actuellement,{" "}
            <strong className="font-semibold text-amber-600">
              {data.colisEnTransit} colis
            </strong>{" "}
            sont en cours d'acheminement (en transit) sur les différentes lignes
            régulières.
          </p>

          <div className="flex items-center gap-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-emerald-900">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                Recette totale consolidée
              </p>
              <p className="text-lg sm:text-xl font-black font-mono text-emerald-800">
                {data.recetteTotale.toLocaleString("fr-FR")} Ar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistiques;
