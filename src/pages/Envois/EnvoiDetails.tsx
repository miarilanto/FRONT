import React from "react";
import type { Envoi } from "./types";

interface EnvoiDetailsProps {
  envoi: Envoi | null;
  onClose: () => void;
}

const EnvoiDetails: React.FC<EnvoiDetailsProps> = ({ envoi, onClose }) => {
  if (!envoi) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        {/* HEADER */}

        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Détails de l'envoi</h2>

          <button onClick={onClose} className="text-gray-500 text-2xl">
            ×
          </button>
        </div>

        {/* CONTENU */}

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500">Colis</p>

            <p className="font-semibold">{envoi.colis}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Envoyeur</p>

            <p className="font-semibold">{envoi.nomEnvoyeur}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>

            <p className="text-blue-600">{envoi.emailEnvoyeur}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Destinataire</p>

            <p className="font-semibold">{envoi.nomRecepteur}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Statut</p>

            {envoi.reception ? (
              <span className="text-green-600 font-semibold">
                ✓ Réceptionné
              </span>
            ) : (
              <span className="text-orange-600 font-semibold">
                ⏳ En transit
              </span>
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnvoiDetails;
