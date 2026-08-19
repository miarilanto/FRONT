import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  RotateCcw,
  Package,
  PackageCheck,
  Clock,
  Car,
  Route,
  Wallet,
  TrendingUp,
  MapPin,
  Filter,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Truck,
  Loader2,
  Calendar,
  Layers,
} from "lucide-react";

import { getDashboard } from "../../services/dashboardApi";

// =========================================================================
// 1. TYPES & INTERFACES
// =========================================================================

type Periode = "today" | "7days" | "30days" | "3months" | "year";
type TabType = "overview" | "analytics" | "fleet" | "colis";

interface DashboardKpi {
  colisEnvoyes: number;
  colisRecus: number;
  colisAttente: number;
  voitures: number;
  itineraires: number;
  totalFrais: number;
}

interface EvolutionColis {
  date: string;
  envoyes: number;
  recus: number;
}

interface ColisDestination {
  destination: string;
  nombre: number;
}

interface ColisItineraire {
  codeit: string;
  villedep: string;
  villearr: string;
  nombre: number;
}

interface FraisEvolution {
  mois: string;
  total: number;
}

interface UtilisationVoiture {
  idvoit: string;
  design: string;
  codeit: string;
  itineraire: string | null;
  nombreEnvois: number;
}

interface ColisAttente {
  idenvoi: number;
  colis: string;
  nomEnvoyeur: string;
  date_envoi: string;
  voiture: string;
  idvoit: string;
  itineraire: string | null;
  statut: string;
}

interface DernierEnvoi {
  idenvoi: number;
  colis: string;
  nomEnvoyeur: string;
  frais: number;
  date_envoi: string;
  idvoit: string;
  voiture: string;
  itineraire: string | null;
  statut: string;
}

interface DashboardData {
  periode: {
    debut: string;
    fin: string;
  };
  kpi: DashboardKpi;
  evolutionColis: EvolutionColis[];
  colisParDestination: ColisDestination[];
  colisParItineraire: ColisItineraire[];
  fraisEvolution: FraisEvolution[];
  utilisationVoitures: UtilisationVoiture[];
  colisEnAttente: ColisAttente[];
  derniersEnvois: DernierEnvoi[];
}

// =========================================================================
// 2. SOUS-COMPOSANTS MODULAIRES
// =========================================================================

// --- KPI CARD ---
interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  highlight?: boolean;
}

function KpiCard({
  label,
  value,
  subtitle,
  icon,
  iconBg,
  highlight,
}: KpiCardProps) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-xs transition-all hover:shadow-md ${
        highlight ? "border-amber-200 bg-amber-50/20" : "border-slate-200/80"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-2 font-mono text-2xl sm:text-3xl font-black text-slate-900">
        {value}
      </p>
      <span className="mt-1 block text-xs text-slate-400">{subtitle}</span>
    </div>
  );
}

// --- GRAPHIQUE D'ÉVOLUTION ---
function EvolutionColisWidget({ data }: { data: EvolutionColis[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-xs text-slate-400">
        Aucune donnée d'évolution disponible.
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.envoyes, d.recus)), 1);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto pb-2">
        <div className="flex h-56 min-w-[500px] items-end gap-3 border-b border-l border-slate-200 px-4 pb-2">
          {data.map((item) => {
            const hEnvoyes = (item.envoyes / maxVal) * 100;
            const hRecus = (item.recus / maxVal) * 100;

            return (
              <div
                key={item.date}
                className="flex h-full flex-1 flex-col justify-end items-center gap-1 group"
              >
                <div className="flex items-end gap-1 w-full justify-center h-full">
                  <div
                    className="w-3 sm:w-4 rounded-t-md bg-blue-600 transition-all group-hover:bg-blue-700"
                    style={{ height: `${Math.max(hEnvoyes, 4)}%` }}
                    title={`Envoyés : ${item.envoyes}`}
                  />
                  <div
                    className="w-3 sm:w-4 rounded-t-md bg-emerald-500 transition-all group-hover:bg-emerald-600"
                    style={{ height: `${Math.max(hRecus, 4)}%` }}
                    title={`Reçus : ${item.recus}`}
                  />
                </div>
                <span className="text-[10px] text-slate-400 truncate w-full text-center mt-1">
                  {item.date}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-6 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-medium">
          <span className="h-3 w-3 rounded-full bg-blue-600" />
          Colis Envoyés
        </div>
        <div className="flex items-center gap-2 font-medium">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          Colis Reçus
        </div>
      </div>
    </div>
  );
}

// --- DESTINATIONS ---
function DestinationWidget({ items }: { items: ColisDestination[] }) {
  const max = Math.max(...items.map((i) => i.nombre), 1);

  return (
    <div className="space-y-3.5">
      {items.length === 0 ? (
        <p className="text-xs text-slate-400">Aucune destination disponible.</p>
      ) : (
        items.map((item) => {
          const pct = Math.round((item.nombre / max) * 100);
          return (
            <div key={item.destination} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" />
                  {item.destination}
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {item.nombre} colis
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// --- ITINÉRAIRES ---
function ItineraireWidget({ items }: { items: ColisItineraire[] }) {
  const max = Math.max(...items.map((i) => i.nombre), 1);

  return (
    <div className="space-y-3.5">
      {items.length === 0 ? (
        <p className="text-xs text-slate-400">Aucun itinéraire disponible.</p>
      ) : (
        items.map((item) => {
          const pct = Math.round((item.nombre / max) * 100);
          return (
            <div key={item.codeit} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span className="flex items-center gap-1.5">
                  <span className="rounded-md bg-blue-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-blue-600 border border-blue-200/60">
                    {item.codeit}
                  </span>
                  <span>
                    {item.villedep} → {item.villearr}
                  </span>
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {item.nombre} envois
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// --- FRAIS ÉVOLUTION ---
function FraisWidget({ items }: { items: FraisEvolution[] }) {
  const max = Math.max(...items.map((i) => i.total), 1);

  return (
    <div className="space-y-3.5">
      {items.length === 0 ? (
        <p className="text-xs text-slate-400">Aucun historique de frais.</p>
      ) : (
        items.map((item) => {
          const pct = Math.round((item.total / max) * 100);
          return (
            <div key={item.mois} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700">
                <span>{item.mois}</span>
                <span className="font-mono font-bold text-emerald-600">
                  {Number(item.total).toLocaleString("fr-FR")} Ar
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// =========================================================================
// 3. COMPOSANT PRINCIPAL DASHBOARD
// =========================================================================

export function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [periode, setPeriode] = useState<Periode>("30days");
  const [codeit, setCodeit] = useState("");
  const [idvoit, setIdvoit] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Charger le dashboard
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDashboard({
        periode,
        codeit: codeit || undefined,
        idvoit: idvoit || undefined,
      });
      setDashboard(data);
    } catch (err) {
      console.error("Erreur dashboard :", err);
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement du dashboard",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [periode, codeit, idvoit]);

  // Formatters
  const formatNumber = (val: number) =>
    new Intl.NumberFormat("fr-FR").format(val);
  const formatMoney = (val: number) =>
    `${new Intl.NumberFormat("fr-FR").format(val)} Ar`;
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("fr-FR");
  };

  // État de chargement initial
  if (loading && !dashboard) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-9 w-9 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Chargement du tableau de bord...
        </p>
      </div>
    );
  }

  // État d'erreur
  if (!dashboard) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-xs">
          <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
          <h3 className="text-base font-bold">
            Impossible de charger le tableau de bord
          </h3>
          <p className="text-xs text-red-600 mt-1">
            {error || "Erreur de connexion serveur."}
          </p>
          <button
            onClick={loadDashboard}
            className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-red-700 active:scale-95 transition-all shadow-sm"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const {
    kpi,
    evolutionColis,
    colisParDestination,
    colisParItineraire,
    fraisEvolution,
    utilisationVoitures,
    colisEnAttente,
    derniersEnvois,
  } = dashboard;

  const maxVoiture = Math.max(
    ...utilisationVoitures.map((item) => item.nombreEnvois),
    1,
  );

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      {/* =====================================================
          1. HEADER BANNER
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <LayoutDashboard className="h-6 w-6" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Tableau de bord logistique
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Vue synthétique et indicateurs clés de performance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 disabled:opacity-50 transition-all"
          >
            <RotateCcw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          2. FILTRES EN RUBAN COMPACT
      ====================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Période */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Période
            </label>
            <select
              value={periode}
              onChange={(e) => setPeriode(e.target.value as Periode)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="today">Aujourd'hui</option>
              <option value="7days">7 derniers jours</option>
              <option value="30days">30 derniers jours</option>
              <option value="3months">3 derniers mois</option>
              <option value="year">Cette année</option>
            </select>
          </div>

          {/* Itinéraire */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Itinéraire
            </label>
            <select
              value={codeit}
              onChange={(e) => setCodeit(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="">Tous les itinéraires</option>
              {colisParItineraire.map((it) => (
                <option key={it.codeit} value={it.codeit}>
                  {it.codeit} ({it.villedep} → {it.villearr})
                </option>
              ))}
            </select>
          </div>

          {/* Voiture */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Véhicule
            </label>
            <select
              value={idvoit}
              onChange={(e) => setIdvoit(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="">Toutes les voitures</option>
              {utilisationVoitures.map((v) => (
                <option key={v.idvoit} value={v.idvoit}>
                  {v.design} ({v.idvoit})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* =====================================================
          3. 6 CARTES KPI PRINCIPALES
      ====================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          label="Colis Envoyés"
          value={formatNumber(kpi.colisEnvoyes)}
          subtitle="Sur la période"
          icon={<Package className="h-5 w-5 text-indigo-600" />}
          iconBg="bg-indigo-50"
        />
        <KpiCard
          label="Colis Reçus"
          value={formatNumber(kpi.colisRecus)}
          subtitle="Réceptions finalisées"
          icon={<PackageCheck className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-50"
        />
        <KpiCard
          label="En Attente"
          value={formatNumber(kpi.colisAttente)}
          subtitle="À surveiller"
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-50"
          highlight={kpi.colisAttente > 0}
        />
        <KpiCard
          label="Flotte Active"
          value={formatNumber(kpi.voitures)}
          subtitle="Véhicules mobilisés"
          icon={<Car className="h-5 w-5 text-sky-600" />}
          iconBg="bg-sky-50"
        />
        <KpiCard
          label="Itinéraires"
          value={formatNumber(kpi.itineraires)}
          subtitle="Lignes régulières"
          icon={<Route className="h-5 w-5 text-purple-600" />}
          iconBg="bg-purple-50"
        />
        <KpiCard
          label="Total Frais"
          value={formatMoney(kpi.totalFrais)}
          subtitle="Recette perçue"
          icon={<Wallet className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-50"
        />
      </div>

      {/* =====================================================
          4. ONGLET DE NAVIGATION (ÉVITE LE SCROLL INFINI)
      ====================================================== */}
      <div className="flex border-b border-slate-200 bg-white px-3 pt-2 rounded-t-2xl shadow-xs">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "overview", label: "Vue d'ensemble", icon: Layers },
            {
              id: "analytics",
              label: "Analyses & Graphiques",
              icon: BarChart3,
            },
            { id: "fleet", label: "Flotte & Lignes", icon: Truck },
            { id: "colis", label: "Suivi des Colis", icon: Package },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex cursor-pointer items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition-all ${
                  active
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================
          5. CONTENU SELON L'ONGLET SÉLECTIONNÉ
      ====================================================== */}

      {/* --- ONGLET 1 : VUE D'ENSEMBLE --- */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Évolution (2 cols) */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Évolution des flux de colis
                  </h3>
                </div>
                <Link
                  to="/rapports/statistiques"
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>Détails</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <EvolutionColisWidget data={evolutionColis} />
            </div>

            {/* Top Destinations (1 col) */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Top Destinations
                  </h3>
                </div>
                <Link
                  to="/itineraires"
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>Tous</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <DestinationWidget items={colisParDestination.slice(0, 5)} />
            </div>
          </div>

          {/* Résumé des derniers colis et alertes */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Colis en attente */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Colis en attente ({kpi.colisAttente})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("colis")}
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>Voir la liste</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {colisEnAttente.slice(0, 4).map((c) => (
                  <div
                    key={c.idenvoi}
                    className="py-2.5 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">
                        Envoi #{c.idenvoi} — {c.colis}
                      </span>
                      <p className="text-slate-400 text-[11px]">
                        {c.nomEnvoyeur} • {c.voiture}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-semibold text-amber-700 border border-amber-200 text-[10px]">
                      En attente
                    </span>
                  </div>
                ))}
                {colisEnAttente.length === 0 && (
                  <p className="text-center py-6 text-slate-400">
                    Aucun colis en attente.
                  </p>
                )}
              </div>
            </div>

            {/* Derniers envois */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-indigo-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Dernières expéditions
                  </h3>
                </div>
                <Link
                  to="/receptions"
                  className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  <span>Réceptions</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {derniersEnvois.slice(0, 4).map((e) => (
                  <div
                    key={e.idenvoi}
                    className="py-2.5 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-800">
                        {e.colis}
                      </span>
                      <p className="text-slate-400 text-[11px]">
                        Envoi #{e.idenvoi} • {e.nomEnvoyeur}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-800">
                        {formatMoney(e.frais)}
                      </span>
                      <p className="text-[10px] text-slate-400">
                        {formatDate(e.date_envoi)}
                      </p>
                    </div>
                  </div>
                ))}
                {derniersEnvois.length === 0 && (
                  <p className="text-center py-6 text-slate-400">
                    Aucun envoi récent.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- ONGLET 2 : ANALYSES & GRAPHIQUES --- */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Itinéraires */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Route className="h-4 w-4 text-purple-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Fréquentation des Itinéraires
                </h3>
              </div>
              <Link
                to="/rapports/itineraires/IT001"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>Rapport Itinéraires</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
            <ItineraireWidget items={colisParItineraire} />
          </div>

          {/* Frais générés */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Évolution des Recettes (Frais)
                </h3>
              </div>
              <Link
                to="/rapports/recette"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>Recette totale</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
            <FraisWidget items={fraisEvolution} />
          </div>
        </div>
      )}

      {/* --- ONGLET 3 : FLOTTE & LIGNES --- */}
      {activeTab === "fleet" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Taux d'utilisation des véhicules
                </h3>
              </div>
              <Link
                to="/rapports/voitures/V001"
                className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>Rapport par véhicule</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {utilisationVoitures.map((v) => {
                const pct = Math.round((v.nombreEnvois / maxVoiture) * 100);
                return (
                  <div
                    key={v.idvoit}
                    className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600">
                        {v.idvoit}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-700">
                        {v.nombreEnvois} envois
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm mt-1">
                      {v.design}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {v.itineraire || "Aucun trajet"}
                    </p>

                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-right text-[10px] font-bold text-slate-500">
                      {pct}% d'activité
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- ONGLET 4 : SUIVI DES COLIS --- */}
      {activeTab === "colis" && (
        <div className="space-y-6">
          {/* Table complète des colis en attente */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Colis en attente de livraison
                </h3>
              </div>
              <Link
                to="/receptions"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                <span>Aller aux réceptions</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600 uppercase">
                  <tr>
                    <th className="px-4 py-3">Réf</th>
                    <th className="px-4 py-3">Colis</th>
                    <th className="px-4 py-3">Expéditeur</th>
                    <th className="px-4 py-3">Trajet</th>
                    <th className="px-4 py-3">Véhicule</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-center">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {colisEnAttente.map((colis) => (
                    <tr key={colis.idenvoi} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-mono font-bold text-blue-600">
                        #{colis.idenvoi}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {colis.colis}
                      </td>
                      <td className="px-4 py-3">{colis.nomEnvoyeur}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {colis.itineraire || "Non défini"}
                      </td>
                      <td className="px-4 py-3">{colis.voiture}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {formatDate(colis.date_envoi)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                          <Clock className="h-3 w-3" />
                          En attente
                        </span>
                      </td>
                    </tr>
                  ))}
                  {colisEnAttente.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-8 text-slate-400"
                      >
                        Aucun colis en attente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Liste détaillée des derniers envois */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  Historique récent des envois
                </h3>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {derniersEnvois.map((envoi) => (
                <div
                  key={envoi.idenvoi}
                  className="flex flex-col gap-3 p-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{envoi.colis}</p>
                      <p className="text-xs text-slate-500">
                        Envoi #{envoi.idenvoi} • Expéditeur :{" "}
                        <span className="font-medium text-slate-700">
                          {envoi.nomEnvoyeur}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {envoi.itineraire || "Ligne standard"} • {envoi.voiture}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-1">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {formatMoney(envoi.frais)}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(envoi.date_envoi)}
                    </span>
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                        envoi.statut === "Reçu"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {envoi.statut}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
