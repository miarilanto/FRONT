import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  getAllItineraires,
  rechercherItineraire,
  createItineraire,
  updateItineraire,
  deleteItineraire,
  getItineraireWithVoitures,
} from "../../services/itineraireApi";

// ==========================================
// TYPES
// ==========================================

interface Itineraire {
  codeit: string;
  villedep: string;
  villearr: string;
  voitures?: unknown[];
}

interface FormItineraire {
  codeit: string;
  villedep: string;
  villearr: string;
}

interface DetailsItineraire {
  codeit: string;
  villedep: string;
  villearr: string;
  voitures?: unknown[];
}

type DialogType = "error" | "success" | "confirm" | "details" | null;

// ==========================================
// COMPOSANT
// ==========================================

function Itineraires() {
  // ==========================================
  // STATES
  // ==========================================

  const [itineraires, setItineraires] = useState<Itineraire[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [editing, setEditing] = useState<Itineraire | null>(null);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState<string | null>(null);

  // ==========================================
  // STATES POUR LES DIALOGUES
  // ==========================================

  const [dialogType, setDialogType] = useState<DialogType>(null);

  const [dialogMessage, setDialogMessage] = useState("");

  const [dialogTitle, setDialogTitle] = useState("");

  const [dialogCode, setDialogCode] = useState<string | null>(null);

  const [details, setDetails] = useState<DetailsItineraire | null>(null);

  // ==========================================
  // FORMULAIRE
  // ==========================================

  const [form, setForm] = useState<FormItineraire>({
    codeit: "",
    villedep: "",
    villearr: "",
  });

  // ==========================================
  // FONCTIONS DIALOGUE
  // ==========================================

  const closeDialog = (): void => {
    setDialogType(null);
    setDialogMessage("");
    setDialogTitle("");
    setDialogCode(null);
    setDetails(null);
  };

  const showError = (message: string): void => {
    setDialogTitle("Erreur");
    setDialogMessage(message);
    setDialogType("error");
  };

  const showSuccess = (message: string): void => {
    setDialogTitle("Succès");
    setDialogMessage(message);
    setDialogType("success");
  };

  // ==========================================
  // CHARGER TOUS LES ITINÉRAIRES
  // GET /api/itineraires
  // ==========================================

  const loadItineraires = async (): Promise<void> => {
    try {
      setLoading(true);

      const data = await getAllItineraires();

      setItineraires(data);
    } catch (error) {
      console.error("Erreur chargement itinéraires :", error);

      showError("Impossible de récupérer les itinéraires.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHARGEMENT INITIAL
  // ==========================================

  useEffect(() => {
    loadItineraires();
  }, []);

  // ==========================================
  // RECHERCHE
  // GET /api/itineraires/recherche?q=...
  // ==========================================

  const handleSearch = async (value: string): Promise<void> => {
    setSearch(value);

    const query = value.trim();

    if (!query) {
      await loadItineraires();
      return;
    }

    try {
      setLoading(true);

      const data = await rechercherItineraire(query);

      setItineraires(data);
    } catch (error) {
      console.error("Erreur recherche :", error);

      showError("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ACTUALISER
  // ==========================================

  const handleRefresh = async (): Promise<void> => {
    setSearch("");

    await loadItineraires();
  };

  // ==========================================
  // OUVRIR MODAL AJOUT
  // ==========================================

  const handleAdd = (): void => {
    setEditing(null);

    setForm({
      codeit: "",
      villedep: "",
      villearr: "",
    });

    setShowModal(true);
  };

  // ==========================================
  // OUVRIR MODAL MODIFICATION
  // ==========================================

  const handleEdit = (itineraire: Itineraire): void => {
    setEditing(itineraire);

    setForm({
      codeit: itineraire.codeit,
      villedep: itineraire.villedep,
      villearr: itineraire.villearr,
    });

    setShowModal(true);
  };

  // ==========================================
  // CHANGEMENT INPUT
  // ==========================================

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // CRÉER / MODIFIER
  // ==========================================

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editing) {
        // ==================================
        // MODIFICATION
        // PUT /api/itineraires/:codeit
        // ==================================

        await updateItineraire(editing.codeit, {
          villedep: form.villedep.trim(),
          villearr: form.villearr.trim(),
        });
      } else {
        // ==================================
        // CRÉATION
        // POST /api/itineraires
        // ==================================

        await createItineraire({
          codeit: form.codeit.trim(),
          villedep: form.villedep.trim(),
          villearr: form.villearr.trim(),
        });
      }

      setShowModal(false);

      setEditing(null);

      setForm({
        codeit: "",
        villedep: "",
        villearr: "",
      });

      await loadItineraires();

      showSuccess(
        editing
          ? "L'itinéraire a été modifié avec succès."
          : "L'itinéraire a été créé avec succès.",
      );
    } catch (error) {
      console.error("Erreur enregistrement :", error);

      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'enregistrement.";

      showError(message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // OUVRIR DIALOGUE CONFIRMATION SUPPRESSION
  // ==========================================

  const handleDelete = (codeit: string): void => {
    setDialogTitle("Confirmer la suppression");

    setDialogMessage(`Voulez-vous vraiment supprimer l'itinéraire ${codeit} ?`);

    setDialogCode(codeit);

    setDialogType("confirm");
  };

  // ==========================================
  // CONFIRMER SUPPRESSION
  // ==========================================

  const confirmDelete = async (): Promise<void> => {
    if (!dialogCode) {
      return;
    }

    const codeit = dialogCode;

    closeDialog();

    try {
      setDeleting(codeit);

      await deleteItineraire(codeit);

      // Retirer directement de l'affichage
      setItineraires((previous) =>
        previous.filter((itineraire) => itineraire.codeit !== codeit),
      );

      showSuccess(`L'itinéraire ${codeit} a été supprimé avec succès.`);
    } catch (error) {
      console.error("Erreur suppression :", error);

      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression.";

      showError(message);
    } finally {
      setDeleting(null);
    }
  };

  // ==========================================
  // VOIR ITINÉRAIRE AVEC SES VOITURES
  // GET /api/itineraires/:codeit/voitures
  // ==========================================

  const handleView = async (codeit: string): Promise<void> => {
    try {
      const data = await getItineraireWithVoitures(codeit);

      console.log("Itinéraire :", data);

      setDetails(data);

      setDialogTitle("Détails de l'itinéraire");

      setDialogType("details");
    } catch (error) {
      console.error("Erreur récupération :", error);

      const message =
        error instanceof Error
          ? error.message
          : "Impossible de récupérer les informations.";

      showError(message);
    }
  };

  // ==========================================
  // INTERFACE
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Itinéraires</h1>

          <p className="mt-1 text-slate-500">Gestion des itinéraires</p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          + Nouvel itinéraire
        </button>
      </div>

      {/* ========================================
          RECHERCHE
      ======================================== */}

      <div className="mb-5 flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Rechercher par code ou ville..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          🔄 Actualiser
        </button>
      </div>

      {/* ========================================
          TABLEAU
      ======================================== */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Code
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Ville de départ
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Ville d'arrivée
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {/* CHARGEMENT */}

            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  Chargement...
                </td>
              </tr>
            )}

            {/* AUCUN RÉSULTAT */}

            {!loading && itineraires.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-slate-500"
                >
                  Aucun itinéraire trouvé.
                </td>
              </tr>
            )}

            {/* LISTE */}

            {!loading &&
              itineraires.map((itineraire) => (
                <tr
                  key={itineraire.codeit}
                  className="transition hover:bg-slate-50"
                >
                  {/* CODE */}

                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {itineraire.codeit}
                  </td>

                  {/* DÉPART */}

                  <td className="px-6 py-4 text-slate-600">
                    {itineraire.villedep}
                  </td>

                  {/* ARRIVÉE */}

                  <td className="px-6 py-4 text-slate-600">
                    {itineraire.villearr}
                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      {/* VOIR */}

                      <button
                        onClick={() => handleView(itineraire.codeit)}
                        className="rounded-lg bg-slate-100 px-3 py-2 transition hover:bg-slate-200"
                        title="Voir les détails"
                      >
                        👁️
                      </button>

                      {/* MODIFIER */}

                      <button
                        onClick={() => handleEdit(itineraire)}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-blue-600 transition hover:bg-blue-100"
                        title="Modifier"
                      >
                        ✏️
                      </button>

                      {/* SUPPRIMER */}

                      <button
                        onClick={() => handleDelete(itineraire.codeit)}
                        disabled={deleting === itineraire.codeit}
                        className="rounded-lg bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Supprimer"
                      >
                        {deleting === itineraire.codeit ? "..." : "🗑️"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* ========================================
          MODAL AJOUT / MODIFICATION
      ======================================== */}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-xl font-bold text-slate-800">
                {editing ? "Modifier l'itinéraire" : "Nouvel itinéraire"}
              </h2>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-xl text-slate-400 transition hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* FORMULAIRE */}

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* CODE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Code itinéraire
                </label>

                <input
                  type="text"
                  name="codeit"
                  value={form.codeit}
                  onChange={handleChange}
                  disabled={editing !== null}
                  required
                  placeholder="Ex : IT001"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
                />
              </div>

              {/* VILLE DÉPART */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Ville de départ
                </label>

                <input
                  type="text"
                  name="villedep"
                  value={form.villedep}
                  onChange={handleChange}
                  required
                  placeholder="Ex : Antananarivo"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* VILLE ARRIVÉE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Ville d'arrivée
                </label>

                <input
                  type="text"
                  name="villearr"
                  value={form.villearr}
                  onChange={handleChange}
                  required
                  placeholder="Ex : Toamasina"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* BOUTONS */}

              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Enregistrement..."
                    : editing
                      ? "Modifier"
                      : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================
          DIALOGUE
      ======================================== */}

      {dialogType && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* ==============================
                DIALOGUE ERREUR
            ============================== */}

            {dialogType === "error" && (
              <>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-100 text-xl">
                      ❌
                    </div>

                    <h2 className="text-xl font-bold text-slate-800">
                      {dialogTitle}
                    </h2>
                  </div>

                  <p className="text-slate-600">{dialogMessage}</p>
                </div>

                <div className="flex justify-end border-t bg-slate-50 px-6 py-4">
                  <button
                    onClick={closeDialog}
                    className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}

            {/* ==============================
                DIALOGUE SUCCÈS
            ============================== */}

            {dialogType === "success" && (
              <>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-xl">
                      ✓
                    </div>

                    <h2 className="text-xl font-bold text-slate-800">
                      {dialogTitle}
                    </h2>
                  </div>

                  <p className="text-slate-600">{dialogMessage}</p>
                </div>

                <div className="flex justify-end border-t bg-slate-50 px-6 py-4">
                  <button
                    onClick={closeDialog}
                    className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-700"
                  >
                    OK
                  </button>
                </div>
              </>
            )}

            {/* ==============================
                DIALOGUE CONFIRMATION
            ============================== */}

            {dialogType === "confirm" && (
              <>
                <div className="p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-100 text-xl">
                      ⚠️
                    </div>

                    <h2 className="text-xl font-bold text-slate-800">
                      {dialogTitle}
                    </h2>
                  </div>

                  <p className="text-slate-600">{dialogMessage}</p>
                </div>

                <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4">
                  <button
                    onClick={closeDialog}
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Annuler
                  </button>

                  <button
                    onClick={confirmDelete}
                    className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </div>
              </>
            )}

            {/* ==============================
                DIALOGUE DÉTAILS
            ============================== */}

            {dialogType === "details" && details && (
              <>
                <div className="border-b px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-xl">
                      👁️
                    </div>

                    <h2 className="text-xl font-bold text-slate-800">
                      {dialogTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 p-6">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Code itinéraire</p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {details.codeit}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Ville de départ</p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {details.villedep}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Ville d'arrivée</p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {details.villearr}
                    </p>
                  </div>

                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-sm text-blue-600">Nombre de voitures</p>

                    <p className="mt-1 text-2xl font-bold text-blue-700">
                      {details.voitures?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end border-t bg-slate-50 px-6 py-4">
                  <button
                    onClick={closeDialog}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Itineraires;
