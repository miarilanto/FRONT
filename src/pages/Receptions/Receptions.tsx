import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  X,
  PackageCheck,
  CalendarCheck,
  Trash2,
  AlertTriangle,
  Eye,
  Loader2,
} from "lucide-react";

import { receptionService } from "../../services/receptionService";

import type { Reception } from "./types";

import ReceptionForm from "./ReceptionForm";
import ReceptionDetails from "./ReceptionDetails";

const Receptions: React.FC = () => {
  const [receptions, setReceptions] = useState<Reception[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Réception sélectionnée pour l'affichage en haut
  const [selectedReception, setSelectedReception] = useState<Reception | null>(
    null,
  );

  // Réception en cours de suppression (contrôle de la boîte de dialogue)
  const [receptionToDelete, setReceptionToDelete] = useState<Reception | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // ==========================================
  // Charger les réceptions
  // ==========================================

  const chargerReceptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await receptionService.getAll();

      setReceptions(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger les réceptions.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Chargement initial
  // ==========================================

  useEffect(() => {
    chargerReceptions();
  }, []);

  // ==========================================
  // Recherche
  // ==========================================

  const rechercher = async (value: string) => {
    setSearch(value);

    if (value.trim() === "") {
      chargerReceptions();
      return;
    }

    try {
      setError(null);

      const data = await receptionService.rechercher(value);

      setReceptions(data);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Erreur lors de la recherche.",
      );
    }
  };

  // ==========================================
  // Confirmation de suppression
  // ==========================================

  const handleConfirmDelete = async () => {
    if (!receptionToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      await receptionService.remove(receptionToDelete.idrecept);

      // Si la réception supprimée était affichée en haut, on la ferme
      if (selectedReception?.idrecept === receptionToDelete.idrecept) {
        setSelectedReception(null);
      }

      // Fermer la modale de confirmation
      setReceptionToDelete(null);

      // Rafraîchir la liste
      await chargerReceptions();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de supprimer la réception.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // ==========================================
  // Format date
  // ==========================================

  const formatDate = (date: string | Date) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ==========================================
  // Nombre de réceptions aujourd'hui
  // ==========================================

  const receptionsAujourdHui = receptions.filter((reception) => {
    const today = new Date().toDateString();

    return new Date(reception.date_recept).toDateString() === today;
  }).length;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ======================================
          1. HEADER
      ====================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Réceptions</h1>

          <p className="mt-1 text-slate-500">Gestion des colis réceptionnés.</p>
        </div>

        <button
          type="button"
          onClick={() =>
            (
              document.getElementById(
                "modal-ajout-reception",
              ) as HTMLDialogElement
            )?.showModal()
          }
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
        >
          <Plus size={18} />
          <span>Ajouter une réception</span>
        </button>
      </div>

      {/* ======================================
          2. MESSAGE D'ERREUR
      ====================================== */}

      {error && (
        <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>

          <button
            type="button"
            onClick={() => setError(null)}
            className="cursor-pointer rounded-lg bg-red-200/80 px-3 py-1 text-xs font-semibold hover:bg-red-300 transition-colors"
          >
            Fermer
          </button>
        </div>
      )}

      {/* ======================================
          3. STATISTIQUES
      ====================================== */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* TOTAL */}
        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total réceptions
              </p>

              <p className="mt-1 text-3xl font-bold text-blue-600">
                {receptions.length}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Réceptions enregistrées
              </p>
            </div>

            <div className="rounded-2xl bg-blue-50 p-3.5">
              <PackageCheck size={26} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* AUJOURD'HUI */}
        <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Réceptions aujourd'hui
              </p>

              <p className="mt-1 text-3xl font-bold text-emerald-600">
                {receptionsAujourdHui}
              </p>

              <p className="mt-1 text-xs text-slate-400">Colis réceptionnés</p>
            </div>

            <div className="rounded-2xl bg-emerald-50 p-3.5">
              <CalendarCheck size={26} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          4. DETAILS DE LA RECEPTION (EN HAUT DU TABLEAU)
      ====================================== */}

      {selectedReception && (
        <div className="transition-all duration-300">
          <ReceptionDetails
            reception={selectedReception}
            onClose={() => setSelectedReception(null)}
          />
        </div>
      )}

      {/* ======================================
          5. RECHERCHE
      ====================================== */}

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Rechercher par colis, envoyeur, récepteur, voiture..."
            value={search}
            onChange={(e) => rechercher(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        {search && (
          <button
            type="button"
            onClick={() => rechercher("")}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 transition-colors"
          >
            <X size={18} />
            Effacer
          </button>
        )}
      </div>

      {/* ======================================
          6. CHARGEMENT
      ====================================== */}

      {loading && (
        <div className="py-4 text-center">
          <p className="text-sm text-slate-500">Chargement des réceptions...</p>
        </div>
      )}

      {/* ======================================
          7. TABLEAU DES RÉCEPTIONS
      ====================================== */}

      {!loading && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-xs border border-slate-200/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              {/* ================================
                  HEADER TABLE
              ================================= */}
              <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Colis</th>
                  <th className="px-6 py-4">Envoyeur</th>
                  <th className="px-6 py-4">Récepteur</th>
                  <th className="px-6 py-4">Voiture</th>
                  <th className="px-6 py-4">Itinéraire</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              {/* ================================
                  BODY
              ================================= */}
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {receptions.map((reception) => {
                  const envoyer = reception.envoyer;
                  const voiture = envoyer?.voiture;
                  const itineraire = voiture?.itineraire;
                  const isSelected =
                    selectedReception?.idrecept === reception.idrecept;

                  return (
                    <tr
                      key={reception.idrecept}
                      className={`transition-colors ${
                        isSelected
                          ? "bg-blue-50/70 font-medium"
                          : "hover:bg-slate-50/80"
                      }`}
                    >
                      {/* COLIS */}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-900">
                          {envoyer?.colis || "-"}
                        </span>
                        <div className="text-xs font-mono text-slate-400">
                          Réf #{reception.idrecept}
                        </div>
                      </td>

                      {/* ENVOYEUR */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">
                          {envoyer?.nomEnvoyeur || "-"}
                        </div>
                        {envoyer?.emailEnvoyeur && (
                          <div className="text-xs text-slate-400">
                            {envoyer.emailEnvoyeur}
                          </div>
                        )}
                      </td>

                      {/* RECEPTEUR */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">
                          {envoyer?.nomRecepteur || "-"}
                        </div>
                        {envoyer?.contactRecepteur && (
                          <div className="text-xs text-slate-400 font-mono">
                            {envoyer.contactRecepteur}
                          </div>
                        )}
                      </td>

                      {/* VOITURE */}
                      <td className="px-6 py-4">
                        {voiture ? (
                          <div className="font-medium text-slate-800">
                            {voiture.design}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* ITINERAIRE */}
                      <td className="px-6 py-4">
                        {itineraire ? (
                          <div>
                            <div className="font-medium text-slate-800">
                              {itineraire.codeit}
                            </div>
                            <div className="text-xs text-slate-500">
                              {itineraire.villedep} {" → "}{" "}
                              {itineraire.villearr}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {formatDate(reception.date_recept)}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {/* BOUTON VOIR */}
                          <button
                            type="button"
                            onClick={() => setSelectedReception(reception)}
                            className={`inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-xs transition-all ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                          >
                            <Eye size={14} />
                            <span>Voir</span>
                          </button>

                          {/* BOUTON SUPPRIMER (OUVRE LA BOÎTE DE DIALOGUE) */}
                          <button
                            type="button"
                            onClick={() => setReceptionToDelete(reception)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-200 transition-colors"
                          >
                            <Trash2 size={14} />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* AUCUNE RÉCEPTION */}
            {receptions.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                <div className="mb-3 text-4xl">📦</div>
                <p className="font-semibold text-slate-700">
                  Aucune réception trouvée
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Aucune réception ne correspond à vos données ou à votre
                  recherche.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          8. BOÎTE DE DIALOGUE DE CONFIRMATION DE SUPPRESSION (MODAL SÉCURISÉ)
      ========================================================================== */}

      {receptionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Icône d'alerte et titre */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Confirmer la suppression
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Cette action est définitive et ne pourra pas être annulée.
                </p>
              </div>
            </div>

            {/* Détails du colis ciblé */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Réception :</span>
                <span className="font-mono font-bold text-slate-800">
                  #{receptionToDelete.idrecept}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Colis :</span>
                <span className="font-semibold text-slate-800">
                  {receptionToDelete.envoyer?.colis || "Non renseigné"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Récepteur :</span>
                <span className="font-semibold text-slate-800">
                  {receptionToDelete.envoyer?.nomRecepteur || "Non renseigné"}
                </span>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setReceptionToDelete(null)}
                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50"
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Suppression...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer définitivement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================
          9. MODAL AJOUT RÉCEPTION
      ====================================== */}

      <dialog id="modal-ajout-reception" className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="mb-2 text-2xl font-bold text-slate-800">
            Ajouter une réception
          </h3>

          <p className="mb-6 text-sm text-slate-500">
            Enregistrer la réception d'un colis envoyé.
          </p>

          <ReceptionForm
            onSuccess={() => {
              (
                document.getElementById(
                  "modal-ajout-reception",
                ) as HTMLDialogElement
              )?.close();
              chargerReceptions();
            }}
            onCancel={() => {
              (
                document.getElementById(
                  "modal-ajout-reception",
                ) as HTMLDialogElement
              )?.close();
            }}
          />
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Receptions;
