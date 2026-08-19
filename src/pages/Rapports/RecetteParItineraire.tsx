import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Map,
  MapPin,
  Car,
  Package,
  Wallet,
  ArrowRight,
  Route,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Loader2,
} from "lucide-react";

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

  // =========================================================
  // CHARGEMENT DES DONNÉES
  // =========================================================

  useEffect(() => {
    if (!codeit) {
      setError("Code itinéraire manquant.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await rapportService.getRecetteParItineraire(codeit);

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des données de l'itinéraire.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [codeit]);

  // =========================================================
  // ÉTAT DE CHARGEMENT
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Chargement de la recette de l'itinéraire...
        </p>
      </div>
    );
  }

  // =========================================================
  // ÉTAT D'ERREUR
  // =========================================================

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

  // =========================================================
  // AUCUNE DONNÉE
  // =========================================================

  if (!data) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-800 shadow-xs">
        <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
        <span className="text-sm font-medium">
          Aucune donnée financière disponible pour cet itinéraire.
        </span>
      </div>
    );
  }

  // =========================================================
  // AFFICHAGE PRINCIPAL
  // =========================================================

  return (
    <div className="space-y-6">
      {/* =====================================================
          1. HEADER COMPOSANT (BANNIÈRE MODERNE)
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <Route className="h-6 w-6" strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Recette par itinéraire
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Détails des performances et des recettes générées pour cet axe de
              transport
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-mono font-bold text-white shadow-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {data.itineraire.codeit}
          </span>
        </div>
      </div>

      {/* =====================================================
          2. INFORMATIONS & SCHÉMA DE L'ITINÉRAIRE
      ====================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Map className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Informations de l'axe</h3>
            <p className="text-xs text-slate-400">
              Villes reliées et code du tronçon
            </p>
          </div>
        </div>

        {/* GRILLE DÉPART / ARRIVÉE */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* CODE */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
            <p className="text-xs font-medium text-slate-500">
              Code itinéraire
            </p>
            <p className="mt-1 font-mono text-base font-bold text-blue-600">
              {data.itineraire.codeit}
            </p>
          </div>

          {/* DÉPART */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-blue-600" />
              <span>Ville de départ</span>
            </div>
            <p className="mt-1 text-base font-bold text-slate-900">
              {data.itineraire.villedep}
            </p>
          </div>

          {/* ARRIVÉE */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>Ville d'arrivée</span>
            </div>
            <p className="mt-1 text-base font-bold text-slate-900">
              {data.itineraire.villearr}
            </p>
          </div>
        </div>

        {/* VISUALISEUR DE TRAJET */}
        <div className="mt-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-blue-50/60 p-4 sm:p-5">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            {/* Ville départ */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-xs border border-blue-100">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Origine
                </span>
                <p className="text-base font-bold text-slate-900 leading-tight">
                  {data.itineraire.villedep}
                </p>
              </div>
            </div>

            {/* Ligne & Flèche animée */}
            <div className="flex flex-1 items-center justify-center px-4">
              <div className="hidden sm:flex flex-1 items-center gap-1 border-t-2 border-dashed border-indigo-200" />
              <div className="mx-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-indigo-600 shadow-xs border border-indigo-100">
                <ArrowRight className="h-4 w-4" />
              </div>
              <div className="hidden sm:flex flex-1 items-center gap-1 border-t-2 border-dashed border-indigo-200" />
            </div>

            {/* Ville arrivée */}
            <div className="flex items-center gap-3 text-right">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Destination
                </span>
                <p className="text-base font-bold text-slate-900 leading-tight">
                  {data.itineraire.villearr}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-xs border border-emerald-100">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          3. STATISTIQUES CLÉS (KPI CARDS)
      ====================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* VÉHICULES */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Voitures assignées
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Car className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-slate-900">
            {data.nombreVoitures}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            Véhicules desservant la ligne
          </span>
        </div>

        {/* ENVOIS */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Volume d'envois
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-slate-900">
            {data.nombreEnvois}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            Colis expédiés sur ce trajet
          </span>
        </div>

        {/* RECETTE */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recette totale
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl sm:text-3xl font-black text-emerald-600">
            {data.recetteTotale.toLocaleString("fr-FR")} Ar
          </p>
          <span className="mt-1 block text-xs text-emerald-700/80 font-medium">
            Revenus bruts générés
          </span>
        </div>
      </div>

      {/* =====================================================
          4. RÉSUMÉ & SYNTHÈSE FINANCIÈRE
      ====================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Bilan récapitulatif</h3>
            <p className="text-xs text-slate-400">
              Synthèse d'activité de l'itinéraire
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-600">
          <p className="leading-relaxed">
            L'itinéraire{" "}
            <strong className="font-semibold text-slate-900">
              {data.itineraire.codeit}
            </strong>{" "}
            assure la liaison directe entre{" "}
            <strong className="font-semibold text-slate-900">
              {data.itineraire.villedep}
            </strong>{" "}
            et{" "}
            <strong className="font-semibold text-slate-900">
              {data.itineraire.villearr}
            </strong>
            .
          </p>

          <p className="leading-relaxed">
            Il est actuellement opéré par{" "}
            <strong className="font-semibold text-slate-900">
              {data.nombreVoitures} véhicule{data.nombreVoitures > 1 ? "s" : ""}
            </strong>{" "}
            et a totalisé{" "}
            <strong className="font-semibold text-slate-900">
              {data.nombreEnvois} envoi{data.nombreEnvois > 1 ? "s" : ""}
            </strong>{" "}
            de colis.
          </p>

          <div className="mt-2 flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-emerald-900">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-700 font-medium">
                Chiffre d'affaires consolidé de la ligne
              </p>
              <p className="text-base sm:text-lg font-black font-mono text-emerald-800">
                {data.recetteTotale.toLocaleString("fr-FR")} Ar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecetteParItineraire;
