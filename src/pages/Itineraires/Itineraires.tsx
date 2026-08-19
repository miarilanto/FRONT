import React, { useEffect, useState, useMemo } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Route,
  Plus,
  Search,
  X,
  RotateCcw,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  ArrowRight,
  Car,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Compass,
  Map,
} from "lucide-react";

import {
  getAllItineraires,
  rechercherItineraire,
  createItineraire,
  updateItineraire,
  deleteItineraire,
  getItineraireWithVoitures,
} from "../../services/itineraireApi";

// =========================================================
// 1. TYPES & INTERFACES
// =========================================================

interface VoitureLiee {
  idvoit: string;
  design: string;
}

interface Itineraire {
  codeit: string;
  villedep: string;
  villearr: string;
  voitures?: VoitureLiee[];
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
  voitures?: VoitureLiee[];
}

// =========================================================
// 2. COMPOSANT PRINCIPAL
// =========================================================

export function Itineraires() {
  const [itineraires, setItineraires] = useState<Itineraire[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Modale d'ajout / édition
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Itineraire | null>(null);
  const [saving, setSaving] = useState(false);

  // Modale de détails
  const [details, setDetails] = useState<DetailsItineraire | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Modale de confirmation de suppression
  const [itineraireToDelete, setItineraireToDelete] =
    useState<Itineraire | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Messages d'alerte / Notification
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Formulaire
  const [form, setForm] = useState<FormItineraire>({
    codeit: "",
    villedep: "",
    villearr: "",
  });

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // ==========================================
  // Charger les itinéraires
  // ==========================================

  const loadItineraires = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getAllItineraires();
      setItineraires(data || []);
    } catch (error) {
      console.error("Erreur chargement itinéraires :", error);
      showNotification("error", "Impossible de récupérer les itinéraires.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItineraires();
  }, []);

  // ==========================================
  // Recherche
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
      setItineraires(data || []);
    } catch (error) {
      console.error("Erreur recherche :", error);
      showNotification("error", "Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (): Promise<void> => {
    setSearch("");
    await loadItineraires();
  };

  // ==========================================
  // Gestion Modal Ajout / Modification
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

  const handleEdit = (itineraire: Itineraire): void => {
    setEditing(itineraire);
    setForm({
      codeit: itineraire.codeit,
      villedep: itineraire.villedep,
      villearr: itineraire.villearr,
    });
    setShowModal(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editing) {
        await updateItineraire(editing.codeit, {
          villedep: form.villedep.trim(),
          villearr: form.villearr.trim(),
        });
      } else {
        await createItineraire({
          codeit: form.codeit.trim().toUpperCase(),
          villedep: form.villedep.trim(),
          villearr: form.villearr.trim(),
        });
      }

      setShowModal(false);
      setEditing(null);
      setForm({ codeit: "", villedep: "", villearr: "" });
      await loadItineraires();

      showNotification(
        "success",
        editing
          ? `L'itinéraire ${editing.codeit} a été mis à jour avec succès.`
          : `L'itinéraire ${form.codeit.toUpperCase()} a été créé avec succès.`,
      );
    } catch (error) {
      console.error("Erreur enregistrement :", error);
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors de l'enregistrement.";
      showNotification("error", message);
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // Suppression sécurisée
  // ==========================================

  const confirmDelete = async (): Promise<void> => {
    if (!itineraireToDelete) return;

    const codeit = itineraireToDelete.codeit;

    try {
      setDeleting(true);
      await deleteItineraire(codeit);

      setItineraires((prev) => prev.filter((it) => it.codeit !== codeit));
      setItineraireToDelete(null);

      showNotification(
        "success",
        `L'itinéraire ${codeit} a été supprimé avec succès.`,
      );
    } catch (error) {
      console.error("Erreur suppression :", error);
      const message =
        error instanceof Error
          ? error.message
          : "Erreur lors de la suppression.";
      showNotification("error", message);
    } finally {
      setDeleting(false);
    }
  };

  // ==========================================
  // Voir les détails avec véhicules
  // ==========================================

  const handleView = async (codeit: string): Promise<void> => {
    try {
      setLoadingDetails(true);
      const data = await getItineraireWithVoitures(codeit);
      setDetails(data);
    } catch (error) {
      console.error("Erreur détails :", error);
      const message =
        error instanceof Error
          ? error.message
          : "Impossible de récupérer les détails de l'itinéraire.";
      showNotification("error", message);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Statistiques calculées
  const totalVilles = useMemo(() => {
    const villes = new Set<string>();
    itineraires.forEach((it) => {
      if (it.villedep) villes.add(it.villedep.trim().toLowerCase());
      if (it.villearr) villes.add(it.villearr.trim().toLowerCase());
    });
    return villes.size;
  }, [itineraires]);

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      {/* =====================================================
          1. HEADER (BANNIÈRE MODERNE)
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <Route className="h-6 w-6" strokeWidth={2} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Gestion des itinéraires
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Configuration des lignes de transport, axes et tronçons
              logistiques
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>Nouvel itinéraire</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          2. NOTIFICATION / ALERTE
      ====================================================== */}
      {notification && (
        <div
          className={`flex items-center justify-between rounded-xl border p-4 shadow-xs transition-all ${
            notification.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            )}
            <span className="text-xs sm:text-sm font-medium">
              {notification.message}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setNotification(null)}
            className="cursor-pointer rounded-lg p-1 text-slate-500 hover:bg-black/5"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* =====================================================
          3. STATISTIQUES EN RUBAN (3 KPI CARDS)
      ====================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* TOTAL ITINÉRAIRES */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Itinéraires
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Route className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-slate-900">
            {itineraires.length}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            Lignes régulières enregistrées
          </span>
        </div>

        {/* VILLES RELIÉES */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Villes Connectées
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-blue-600">
            {totalVilles}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            Pôles urbains desservis
          </span>
        </div>

        {/* COUVERTURE RÉSEAU */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Réseau National
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Compass className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl sm:text-3xl font-black text-emerald-600">
            100% Opérationnel
          </p>
          <span className="mt-1 block text-xs font-medium text-emerald-700/80">
            Trafic fluide & disponible
          </span>
        </div>
      </div>

      {/* =====================================================
          4. RECHERCHE & FILTRAGE
      ====================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par code (ex: IT001) ou ville..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <RotateCcw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Actualiser</span>
          </button>

          <span className="text-xs text-slate-400">
            <strong className="text-slate-700 font-semibold">
              {itineraires.length}
            </strong>{" "}
            lignes
          </span>
        </div>
      </div>

      {/* =====================================================
          5. CHARGEMENT
      ====================================================== */}
      {loading && itineraires.length === 0 && (
        <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500">
            Chargement des itinéraires...
          </p>
        </div>
      )}

      {/* =====================================================
          6. TABLEAU DES ITINÉRAIRES
      ====================================================== */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-6 py-4">Code Itinéraire</th>
                <th className="px-6 py-4">Ville de départ</th>
                <th className="px-6 py-4">Ville d'arrivée</th>
                <th className="px-6 py-4">Schéma du Trajet</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {itineraires.map((itineraire) => (
                <tr
                  key={itineraire.codeit}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  {/* CODE ITINÉRAIRE */}
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-mono font-bold text-blue-700 border border-blue-200/80">
                      {itineraire.codeit}
                    </span>
                  </td>

                  {/* VILLE DÉPART */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                      <span className="font-semibold text-slate-900">
                        {itineraire.villedep}
                      </span>
                    </div>
                  </td>

                  {/* VILLE ARRIVÉE */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold text-slate-900">
                        {itineraire.villearr}
                      </span>
                    </div>
                  </td>

                  {/* VISUALISATION DU TRAJET */}
                  <td className="px-6 py-4">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200/70 bg-slate-50/80 px-3 py-1.5 text-xs">
                      <span className="font-medium text-slate-700">
                        {itineraire.villedep}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-500" />
                      <span className="font-medium text-slate-700">
                        {itineraire.villearr}
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {/* BOUTON VOIR */}
                      <button
                        type="button"
                        onClick={() => handleView(itineraire.codeit)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                        title="Voir les détails et véhicules"
                      >
                        <Eye size={13} />
                        <span>Voir</span>
                      </button>

                      {/* BOUTON MODIFIER */}
                      <button
                        type="button"
                        onClick={() => handleEdit(itineraire)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 border border-amber-200/80 hover:bg-amber-100 transition-colors"
                        title="Modifier l'itinéraire"
                      >
                        <Pencil size={13} />
                        <span>Modifier</span>
                      </button>

                      {/* BOUTON SUPPRIMER */}
                      <button
                        type="button"
                        onClick={() => setItineraireToDelete(itineraire)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 border border-red-200/80 hover:bg-red-100 transition-colors"
                        title="Supprimer l'itinéraire"
                      >
                        <Trash2 size={13} />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && itineraires.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Route className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">
                      Aucun itinéraire trouvé
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Aucune ligne de transport ne correspond à votre recherche.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          7. MODALE AJOUT / MODIFICATION D'UN ITINÉRAIRE
      ========================================================================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header modale */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
                  <Route size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {editing
                      ? `Modifier l'itinéraire ${editing.codeit}`
                      : "Créer un nouvel itinéraire"}
                  </h3>
                  <p className="text-xs text-blue-100">
                    Définissez le code et les villes de départ et d'arrivée
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="cursor-pointer rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Code Itinéraire */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Code Itinéraire <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="codeit"
                  value={form.codeit}
                  onChange={handleChange}
                  disabled={editing !== null}
                  required
                  placeholder="Ex : IT001, IT-TNR-TMV"
                  className="w-full uppercase rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {editing && (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Le code d'itinéraire est unique et ne peut pas être modifié.
                  </p>
                )}
              </div>

              {/* Ville de Départ */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Ville de départ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="villedep"
                  value={form.villedep}
                  onChange={handleChange}
                  required
                  placeholder="Ex : Antananarivo"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Ville d'Arrivée */}
              <div>
                <label className="mb-1 block text-xs font-bold text-slate-700">
                  Ville d'arrivée <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="villearr"
                  value={form.villearr}
                  onChange={handleChange}
                  required
                  placeholder="Ex : Toamasina, Mahajanga..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setShowModal(false)}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>
                      {editing ? "Mettre à jour" : "Enregistrer l'axe"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. MODALE DÉTAILS D'UN ITINÉRAIRE & VOITURES ASSIGNÉES
      ========================================================================== */}
      {details && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
                  <Map size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    Détails de l'axe {details.codeit}
                  </h3>
                  <p className="text-xs text-blue-100">
                    Informations du tronçon et véhicules
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetails(null)}
                className="cursor-pointer rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-4">
              {/* Carte Trajet */}
              <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-blue-50/60 via-indigo-50/40 to-blue-50/60 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Départ
                      </span>
                      <p className="text-sm font-bold text-slate-800">
                        {details.villedep}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 text-indigo-500" />

                  <div className="flex items-center gap-2 text-right">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        Arrivée
                      </span>
                      <p className="text-sm font-bold text-slate-800">
                        {details.villearr}
                      </p>
                    </div>
                    <MapPin className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>
              </div>

              {/* Véhicules assignés */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Car size={14} className="text-sky-600" />
                    Voitures desservant la ligne
                  </span>
                  <span className="rounded-md bg-sky-100 px-2 py-0.5 text-sky-800 font-mono">
                    {details.voitures?.length || 0} véhicule(s)
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 rounded-xl border border-slate-200 bg-slate-50/50 p-2">
                  {details.voitures && details.voitures.length > 0 ? (
                    details.voitures.map((v) => (
                      <div
                        key={v.idvoit}
                        className="flex items-center justify-between p-2 text-xs"
                      >
                        <span className="font-mono font-bold text-slate-800">
                          {v.idvoit}
                        </span>
                        <span className="text-slate-600">{v.design}</span>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-center text-xs text-slate-400">
                      Aucune voiture n'est actuellement affectée à cet
                      itinéraire.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-3">
              <button
                type="button"
                onClick={() => setDetails(null)}
                className="cursor-pointer rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          9. BOÎTE DE DIALOGUE DE CONFIRMATION DE SUPPRESSION (MODAL SÉCURISÉ)
      ========================================================================== */}
      {itineraireToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Alerte icône et titre */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Supprimer l'itinéraire
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Êtes-vous sûr de vouloir supprimer cet itinéraire ? Cette
                  action est irréversible.
                </p>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Code itinéraire :</span>
                <span className="font-mono font-bold text-blue-600">
                  {itineraireToDelete.codeit}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Liaison :</span>
                <span className="font-semibold text-slate-800">
                  {itineraireToDelete.villedep} → {itineraireToDelete.villearr}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setItineraireToDelete(null)}
                className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
              >
                Annuler
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {deleting ? (
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
    </div>
  );
}

export default Itineraires;
