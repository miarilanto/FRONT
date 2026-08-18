import React, { useEffect, useState } from "react";
import type { Envoi } from "./types";
import { envoiService } from "../../services/envoiService";

const Envois: React.FC = () => {
  const [envois, setEnvois] = useState<Envoi[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [sendingEmail, setSendingEmail] = useState<number | null>(null);

  const [message, setMessage] = useState<string>("");

  const [error, setError] = useState<string>("");

  // ==========================================
  // CHARGER LES ENVOIS
  // ==========================================

  const chargerEnvois = async () => {
    try {
      setLoading(true);

      setError("");

      const data = await envoiService.getAll();

      setEnvois(data);
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message || "Impossible de charger les envois.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerEnvois();
  }, []);

  // ==========================================
  // ENVOYER EMAIL
  // ==========================================

  const handleEnvoyerEmail = async (envoi: Envoi) => {
    try {
      setSendingEmail(envoi.idenvoi);

      setMessage("");

      setError("");

      await envoiService.envoyerEmailReception(envoi.idenvoi);

      setMessage(`Email envoyé à ${envoi.emailEnvoyeur}`);
    } catch (error: any) {
      console.error(error);

      setError(
        error.response?.data?.message || "Impossible d'envoyer l'email.",
      );
    } finally {
      setSendingEmail(null);
    }
  };

  // ==========================================
  // AFFICHAGE
  // ==========================================

  if (loading) {
    return <div className="p-6">Chargement des envois...</div>;
  }

  return (
    <div className="p-6">
      {/* TITRE */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Envois</h1>

        <p className="text-gray-500">Gestion des notifications par email</p>
      </div>

      {/* MESSAGE SUCCÈS */}

      {message && (
        <div className="mb-4 rounded-lg bg-green-100 border border-green-300 px-4 py-3 text-green-700">
          ✓ {message}
        </div>
      )}

      {/* MESSAGE ERREUR */}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 border border-red-300 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* TABLE */}

      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Colis</th>

                <th className="px-4 py-3 text-left">Envoyeur</th>

                <th className="px-4 py-3 text-left">Email</th>

                <th className="px-4 py-3 text-left">Destinataire</th>

                <th className="px-4 py-3 text-center">Statut</th>

                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {envois.map((envoi) => (
                <tr key={envoi.idenvoi} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <span className="font-semibold">{envoi.colis}</span>
                  </td>

                  <td className="px-4 py-4">{envoi.nomEnvoyeur}</td>

                  <td className="px-4 py-4">
                    <span className="text-blue-600">{envoi.emailEnvoyeur}</span>
                  </td>

                  <td className="px-4 py-4">{envoi.nomRecepteur}</td>

                  <td className="px-4 py-4 text-center">
                    {envoi.reception ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                        Réceptionné
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                        En transit
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => handleEnvoyerEmail(envoi)}
                      disabled={sendingEmail === envoi.idenvoi}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {sendingEmail === envoi.idenvoi
                        ? "Envoi..."
                        : "📧 Envoyer email"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Envois;
