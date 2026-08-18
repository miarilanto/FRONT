import React from "react";
import {
  Package,
  ClipboardList,
  Truck,
  MapPin,
  X,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import type { Reception } from "./types";

interface ReceptionDetailsProps {
  reception: Reception | null;
  onClose: () => void;
}

const formatDate = (date: string) => {
  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* --------------------------------------------------------------------- */
/* Sous-composants                                                       */
/* --------------------------------------------------------------------- */

interface InfoCardProps {
  label: string;
  value: React.ReactNode;
  emphasis?: boolean;
}

function InfoCard({ label, value, emphasis }: InfoCardProps) {
  return (
    <div className="bg-base-100 rounded-lg p-3">
      <p className="text-xs opacity-60">{label}</p>
      <p className={emphasis ? "font-bold text-lg" : "font-semibold"}>
        {value}
      </p>
    </div>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="card bg-base-200 border border-base-300">
      <div className="card-body p-4">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h4 className="font-bold">{title}</h4>
        </div>

        {children}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------- */
/* Composant principal                                                   */
/* --------------------------------------------------------------------- */

const ReceptionDetails: React.FC<ReceptionDetailsProps> = ({
  reception,
  onClose,
}) => {
  if (!reception) {
    return null;
  }

  const envoyer = reception.envoyer;
  const voiture = envoyer?.voiture;
  const itineraire = voiture?.itineraire;

  return (
    <dialog open className="modal modal-middle">
      <div className="modal-box max-w-4xl p-0 overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-content px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary-content/20 rounded-xl p-3">
                <Package className="h-6 w-6" strokeWidth={2} />
              </div>

              <div>
                <h3 className="text-xl font-bold">Détails de la réception</h3>

                <p className="text-sm opacity-80">
                  Informations sur le colis réceptionné
                </p>
              </div>
            </div>

            <div className="badge badge-success badge-lg gap-1">
              <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
              Réceptionnée
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5 space-y-4">
          {/* Informations réception */}
          <Section
            icon={<ClipboardList className="h-5 w-5" strokeWidth={2} />}
            title="Informations de réception"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard
                label="Date de réception"
                value={formatDate(reception.date_recept)}
              />

              <InfoCard
                label="Statut"
                value={<span className="text-success">Réceptionnée</span>}
              />
            </div>
          </Section>

          {/* Informations colis */}
          <Section
            icon={<Package className="h-5 w-5" strokeWidth={2} />}
            title="Informations du colis"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <InfoCard
                label="Colis"
                value={envoyer?.colis || "Non renseigné"}
              />

              <InfoCard
                label="Envoyeur"
                value={envoyer?.nomEnvoyeur || "Non renseigné"}
              />

              <InfoCard
                label="Récepteur"
                value={envoyer?.nomRecepteur || "Non renseigné"}
              />

              <InfoCard
                label="Contact"
                value={envoyer?.contactRecepteur || "Non renseigné"}
              />
            </div>
          </Section>

          {/* Informations transport */}
          <Section
            icon={<Truck className="h-5 w-5" strokeWidth={2} />}
            title="Informations transport"
          >
            {voiture ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <InfoCard label="Véhicule" value={voiture.design} />

                {itineraire && (
                  <>
                    <InfoCard
                      label="Itinéraire"
                      value={itineraire.codeit}
                      emphasis
                    />

                    <InfoCard
                      label="Trajet"
                      value={
                        <span className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {itineraire.villedep} → {itineraire.villearr}
                        </span>
                      }
                    />
                  </>
                )}
              </div>
            ) : (
              <div className="alert alert-warning">
                <AlertTriangle className="h-5 w-5" strokeWidth={2} />

                <span>Aucune information de transport disponible.</span>
              </div>
            )}
          </Section>
        </div>

        {/* Footer */}
        <div className="border-t border-base-300 px-6 py-4 flex justify-end bg-base-200/50">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>

      {/* Backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose} aria-label="Fermer">
          <X className="h-4 w-4" />
        </button>
      </form>
    </dialog>
  );
};

export default ReceptionDetails;
