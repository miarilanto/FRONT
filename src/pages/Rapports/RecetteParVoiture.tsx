import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Car,
  MapPin,
  Route,
  Package,
  Wallet,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Loader2,
  Info,
} from "lucide-react";

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
      setError("Identifiant de voiture manquant.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await rapportService.getRecetteParVoiture(idvoit);
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement des données du véhicule.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idvoit]);

  // =========================================================
  // ÉTAT DE CHARGEMENT
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium text-slate-500">
          Chargement de la recette du véhicule...
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
          Aucune donnée financière disponible pour cette voiture.
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          1. HEADER (BANNIÈRE MODERNE)
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <Car className="h-6 w-6" strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Recette par voiture
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Rentabilité et volume des envois traités par ce véhicule
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-xs font-mono font-bold text-white shadow-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {data.voiture.idvoit}
          </span>
        </div>
      </div>

      {/* =====================================================
          2. INFORMATIONS DU VÉHICULE & ITINÉRAIRE
      ====================================================== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* CARTE 1 : INFORMATIONS VÉHICULE */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 text-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Info className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Informations du véhicule</h3>
              <p className="text-xs text-slate-400">
                Identifiant et désignation
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
              <p className="text-xs font-medium text-slate-500">
                Identifiant (ID)
              </p>
              <p className="mt-1 font-mono text-base font-bold text-blue-600">
                {data.voiture.idvoit}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
              <p className="text-xs font-medium text-slate-500">
                Désignation / Modèle
              </p>
              <p className="mt-1 text-base font-bold text-slate-900">
                {data.voiture.design}
              </p>
            </div>
          </div>
        </div>

        {/* CARTE 2 : ITINÉRAIRE LIÉ */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 text-slate-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Route className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Ligne de transport assignée</h3>
              <p className="text-xs text-slate-400">
                Trajet régulier du véhicule
              </p>
            </div>
          </div>

          <div className="mt-4">
            {data.itineraire ? (
              <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-blue-50/60 p-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Départ
                      </span>
                      <p className="text-sm font-bold text-slate-800 leading-tight">
                        {data.itineraire.villedep}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3">
                    <span className="rounded-md bg-white/80 px-2 py-0.5 text-[11px] font-mono font-bold text-indigo-700 border border-indigo-200/70">
                      {data.itineraire.codeit}
                    </span>
                    <ArrowRight className="h-4 w-4 text-indigo-500" />
                  </div>

                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Arrivée
                      </span>
                      <p className="text-sm font-bold text-slate-800 leading-tight">
                        {data.itineraire.villearr}
                      </p>
                    </div>
                    <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>
                  Aucun itinéraire régulier n'est actuellement associé à cette
                  voiture.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =====================================================
          3. STATISTIQUES CLÉS (2 KPI CARDS)
      ====================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* NOMBRE D'ENVOIS */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total colis transportés
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl sm:text-4xl font-black text-slate-900">
            {data.nombreEnvois}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            Envois traités par ce véhicule
          </span>
        </div>

        {/* RECETTE TOTALE */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Recette totale générée
            </span>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Wallet className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl sm:text-3xl font-black text-emerald-600">
            {data.recetteTotale.toLocaleString("fr-FR")} Ar
          </p>
          <span className="mt-1 block text-xs font-medium text-emerald-700/80">
            Chiffre d'affaires cumulé
          </span>
        </div>
      </div>

      {/* =====================================================
          4. BILAN & RÉSUMÉ
      ====================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 text-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold">Bilan de performance</h3>
            <p className="text-xs text-slate-400">
              Synthèse d'activité du véhicule
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-3.5 text-xs sm:text-sm text-slate-600">
          <p className="leading-relaxed">
            Le véhicule{" "}
            <strong className="font-semibold text-slate-900">
              {data.voiture.design}
            </strong>{" "}
            (identifiant{" "}
            <span className="font-mono font-semibold text-blue-600">
              {data.voiture.idvoit}
            </span>
            ) totalise{" "}
            <strong className="font-semibold text-slate-900">
              {data.nombreEnvois} envoi{data.nombreEnvois > 1 ? "s" : ""}
            </strong>{" "}
            de colis enregistrés.
          </p>

          <div className="flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-emerald-900">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-700 font-medium">
                Recette totale générée par le véhicule
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

export default RecetteParVoiture;
