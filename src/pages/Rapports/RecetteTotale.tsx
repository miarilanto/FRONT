import React, { useEffect, useState } from "react";
import {
  Home,
  Package,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Coins,
} from "lucide-react";

import { rapportService } from "../../services/rapportService";

interface RecetteTotaleData {
  nombreEnvois: number;
  recetteTotale: number;
}

const RecetteTotale: React.FC = () => {
  const [data, setData] = useState<RecetteTotaleData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // CHARGEMENT DES DONNÉES
  // =========================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await rapportService.getRecetteTotale();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors de la récupération de la recette totale.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // =========================================================
  // ÉTAT DE CHARGEMENT
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Calcul de la recette globale en cours...
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
          Aucune donnée financière globale disponible pour le moment.
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
          1. HEADER (BANNIÈRE MODERNE)
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <Home className="h-6 w-6" strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Recette totale globale
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Vue consolidée de l'ensemble des revenus générés par les envois de
              colis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Bilan général actif
          </span>
        </div>
      </div>

      {/* =====================================================
          2. STATISTIQUES CLÉS (2 KPI CARDS)
      ====================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* TOTAL ENVOIS */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Volume total d'envois
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl sm:text-4xl font-black text-slate-900">
            {data.nombreEnvois}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            Colis enregistrés et traités
          </span>
        </div>

        {/* RECETTE TOTALE */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Chiffre d'affaires global
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl sm:text-3xl font-black text-emerald-600">
            {data.recetteTotale.toLocaleString("fr-FR")} Ar
          </p>
          <span className="mt-1 block text-xs font-medium text-emerald-700/80">
            Total des recettes perçues
          </span>
        </div>
      </div>

      {/* =====================================================
          3. BILAN & RÉSUMÉ CONSOLIDÉ
      ====================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Synthèse d'activité globale</h3>
            <p className="text-xs text-slate-400">
              Bilan d'exploitation général
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-600">
          <p className="leading-relaxed">
            Le système compte actuellement un total de{" "}
            <strong className="font-semibold text-slate-900">
              {data.nombreEnvois} envoi{data.nombreEnvois > 1 ? "s" : ""}
            </strong>{" "}
            de colis enregistrés à travers l'ensemble des agences et lignes
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

export default RecetteTotale;
