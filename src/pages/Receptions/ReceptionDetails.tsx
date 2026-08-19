import React from "react";
import {
  Package,
  Truck,
  MapPin,
  Mail,
  Phone,
  CalendarDays,
  CircleDollarSign,
  X,
  CheckCircle2,
  User,
  ArrowRight,
} from "lucide-react";

import type { Reception } from "./types";

interface ReceptionDetailsProps {
  reception: Reception | null;
  onClose: () => void;
}

// ======================================================
// FORMATTEURS
// ======================================================

const formatDate = (date: string | Date | undefined) => {
  if (!date) return "Non renseignée";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return String(date);

  return parsedDate.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatFrais = (frais: number | string | undefined) => {
  if (frais === undefined || frais === null || frais === "") {
    return "Non renseigné";
  }
  return `${Number(frais).toLocaleString("fr-FR")} Ar`;
};

// ======================================================
// SOUS-COMPOSANT : CELLULE D'INFORMATION COMPACTE
// ======================================================

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  highlight?: boolean;
}

function InfoItem({ label, value, icon, highlight }: InfoItemProps) {
  return (
    <div
      className={`flex items-start gap-2.5 rounded-lg border p-2.5 transition-colors ${
        highlight
          ? "border-blue-200 bg-blue-50/50"
          : "border-slate-200/80 bg-white"
      }`}
    >
      {icon && (
        <div
          className={`mt-0.5 shrink-0 ${
            highlight ? "text-blue-600" : "text-slate-400"
          }`}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <div className="truncate text-sm font-semibold text-slate-800">
          {value}
        </div>
      </div>
    </div>
  );
}

// ======================================================
// COMPOSANT PRINCIPAL
// ======================================================

const ReceptionDetails: React.FC<ReceptionDetailsProps> = ({
  reception,
  onClose,
}) => {
  if (!reception) return null;

  const envoi = reception.envoyer;
  const voiture = envoi?.voiture;
  const itineraire = voiture?.itineraire;

  return (
    <dialog
      open
      className="modal modal-open modal-middle bg-slate-900/40 backdrop-blur-xs z-50"
    >
      <div className="modal-box max-w-4xl w-11/12 p-0 overflow-hidden bg-slate-50 shadow-2xl rounded-2xl border border-slate-200">
        {/* ================= HEADER COMPACT ================= */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-2 text-white">
              <Package className="h-5 w-5" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-lg font-bold leading-tight">
                Détails de la réception
              </h3>
              <p className="text-xs text-blue-100">
                Colis :{" "}
                <span className="font-semibold text-white">
                  {envoi?.colis || "Non renseigné"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-xs">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Réceptionnée
            </div>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-xs btn-circle text-white/80 hover:bg-white/20 hover:text-white"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ================= CONTENU (GRID 2 COLONNES) ================= */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* COLONNE GAUCHE : COLIS & ACTEURS */}
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Package className="h-4 w-4 text-blue-600" />
              Informations du Colis & Envoi
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoItem
                label="Nom du Colis"
                value={envoi?.colis || "Non renseigné"}
                icon={<Package className="h-4 w-4" />}
                highlight
              />
              <InfoItem
                label="Frais d'envoi"
                value={
                  <span className="text-emerald-700">
                    {formatFrais(envoi?.frais)}
                  </span>
                }
                icon={<CircleDollarSign className="h-4 w-4 text-emerald-600" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoItem
                label="Envoyeur"
                value={envoi?.nomEnvoyeur || "Non renseigné"}
                icon={<User className="h-4 w-4" />}
              />
              <InfoItem
                label="Email Envoyeur"
                value={envoi?.emailEnvoyeur || "Non renseigné"}
                icon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <InfoItem
                label="Destinataire"
                value={envoi?.nomRecepteur || "Non renseigné"}
                icon={<User className="h-4 w-4" />}
              />
              <InfoItem
                label="Contact Récepteur"
                value={envoi?.contactRecepteur || "Non renseigné"}
                icon={<Phone className="h-4 w-4" />}
              />
            </div>

            <InfoItem
              label="Date d'envoi"
              value={formatDate(envoi?.date_envoi)}
              icon={<CalendarDays className="h-4 w-4" />}
            />
          </div>

          {/* COLONNE DROITE : RÉCEPTION & TRANSPORT */}
          <div className="space-y-3">
            {/* BLOC RÉCEPTION */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs space-y-2">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Statut de Réception
              </div>

              <div className="grid grid-cols-2 gap-2">
                <InfoItem
                  label="Date de réception"
                  value={formatDate(reception.date_recept)}
                  icon={<CalendarDays className="h-4 w-4 text-emerald-600" />}
                  highlight
                />
                <InfoItem
                  label="État"
                  value={
                    <span className="text-emerald-600 font-bold">
                      Réceptionnée
                    </span>
                  }
                  icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                />
              </div>
            </div>

            {/* BLOC TRANSPORT */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs space-y-2">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                <Truck className="h-4 w-4 text-indigo-600" />
                Transport & Acheminement
              </div>

              {voiture ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <InfoItem
                      label="Véhicule"
                      value={
                        <span>
                          {voiture.design}{" "}
                          <span className="text-xs text-slate-400 font-normal">
                            ({voiture.idvoit})
                          </span>
                        </span>
                      }
                      icon={<Truck className="h-4 w-4" />}
                    />
                    <InfoItem
                      label="Code Itinéraire"
                      value={itineraire?.codeit || "Non spécifié"}
                      icon={<MapPin className="h-4 w-4" />}
                    />
                  </div>

                  {itineraire && (
                    <div className="flex items-center justify-between rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-xs">
                      <span className="font-semibold text-slate-700">
                        {itineraire.villedep}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="font-semibold text-slate-700">
                        {itineraire.villearr}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg bg-amber-50 p-2.5 text-xs text-amber-700 border border-amber-200">
                  Aucune information de transport liée.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= FOOTER COMPACT ================= */}
        <div className="flex justify-end border-t border-slate-200 bg-white px-5 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-1.5 text-sm font-medium text-white shadow-xs transition hover:bg-slate-700 focus:outline-hidden"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* BACKDROP */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose} aria-label="Fermer" />
      </form>
    </dialog>
  );
};

export default ReceptionDetails;
