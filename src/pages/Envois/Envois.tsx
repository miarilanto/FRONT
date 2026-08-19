import React, { useEffect, useState, useMemo } from "react";
import {
  PackageOpen,
  Plus,
  Search,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Truck,
  Wallet,
  Calendar,
  User,
  Mail,
  Phone,
  Package,
  MapPin,
  ArrowRight,
  Loader2,
  Coins,
} from "lucide-react";

import {
  getEnvois,
  rechercherEnvois,
  createEnvoi,
  updateEnvoi,
  deleteEnvoi,
} from "../../services/envoyer.services";

import { getVoitures } from "../../services/voiture.services";

// =========================================================
// 1. TYPES & INTERFACES
// =========================================================

interface Itineraire {
  codeit: string;
  villedep: string;
  villearr: string;
}

interface VoitureOption {
  idvoit: string;
  design: string;
  codeit?: string;
  itineraire?: Itineraire;
}

interface EnvoiItem {
  idenvoi: number;
  idvoit: string;
  colis: string;
  nomEnvoyeur: string;
  emailEnvoyeur?: string;
  date_envoi: string;
  frais: number;
  nomRecepteur: string;
  contactRecepteur: string;
  voiture?: VoitureOption;
}

// =========================================================
// 2. COMPOSANT PRINCIPAL
// =========================================================

export function Envois() {
  const [envois, setEnvois] = useState<EnvoiItem[]>([]);
  const [voitures, setVoitures] = useState<VoitureOption[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Modale d'ajout / modification
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modale de confirmation de suppression
  const [envoiToDelete, setEnvoiToDelete] = useState<EnvoiItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    idvoit: "",
    colis: "",
    nomEnvoyeur: "",
    emailEnvoyeur: "",
    date_envoi: "",
    frais: "",
    nomRecepteur: "",
    contactRecepteur: "",
  });

  // ==========================================
  // Charger les données
  // ==========================================

  const chargerEnvois = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEnvois();
      setEnvois(data || []);
    } catch (err) {
      console.error(err);
      setError("Impossible de récupérer la liste des envois.");
    } finally {
      setLoading(false);
    }
  };

  const chargerVoitures = async () => {
    try {
      const data = await getVoitures();
      setVoitures(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    chargerEnvois();
    chargerVoitures();
  }, []);

  // ==========================================
  // Recherche
  // ==========================================

  const rechercher = async (value: string) => {
    setSearch(value);

    if (value.trim() === "") {
      chargerEnvois();
      return;
    }

    try {
      setError(null);
      const data = await rechercherEnvois(value);
      setEnvois(data || []);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la recherche.");
    }
  };

  // ==========================================
  // Gestion formulaire
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const ouvrirAjout = () => {
    setEditingId(null);
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    setFormData({
      idvoit: voitures.length > 0 ? voitures[0].idvoit : "",
      colis: "",
      nomEnvoyeur: "",
      emailEnvoyeur: "",
      date_envoi: now.toISOString().slice(0, 16),
      frais: "",
      nomRecepteur: "",
      contactRecepteur: "",
    });

    setShowFormModal(true);
  };

  const ouvrirModification = (envoi: EnvoiItem) => {
    setEditingId(envoi.idenvoi);

    const formattedDate = envoi.date_envoi
      ? new Date(envoi.date_envoi).toISOString().slice(0, 16)
      : "";

    setFormData({
      idvoit: envoi.idvoit || "",
      colis: envoi.colis || "",
      nomEnvoyeur: envoi.nomEnvoyeur || "",
      emailEnvoyeur: envoi.emailEnvoyeur || "",
      date_envoi: formattedDate,
      frais: String(envoi.frais ?? ""),
      nomRecepteur: envoi.nomRecepteur || "",
      contactRecepteur: envoi.contactRecepteur || "",
    });

    setShowFormModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        idvoit: formData.idvoit,
        colis: formData.colis,
        nomEnvoyeur: formData.nomEnvoyeur,
        emailEnvoyeur: formData.emailEnvoyeur,
        date_envoi: formData.date_envoi,
        frais: Number(formData.frais),
        nomRecepteur: formData.nomRecepteur,
        contactRecepteur: formData.contactRecepteur,
      };

      if (editingId !== null) {
        await updateEnvoi(editingId, payload);
      } else {
        await createEnvoi(payload);
      }

      setShowFormModal(false);
      await chargerEnvois();
    } catch (err) {
      console.error(err);
      setError("Impossible d'enregistrer l'envoi. Vérifiez les champs saisis.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==========================================
  // Suppression sécurisée
  // ==========================================

  const handleConfirmDelete = async () => {
    if (!envoiToDelete) return;

    try {
      setIsDeleting(true);
      setError(null);

      await deleteEnvoi(envoiToDelete.idenvoi);
      setEnvoiToDelete(null);
      await chargerEnvois();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer l'envoi sélectionné.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Formatters
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime())
      ? dateStr
      : d.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const formatMoney = (val: number | string) =>
    `${Number(val || 0).toLocaleString("fr-FR")} Ar`;

  // Statistiques calculées
  const totalFrais = useMemo(
    () => envois.reduce((sum, item) => sum + (Number(item.frais) || 0), 0),
    [envois],
  );

  const totalVehiculesUtilises = useMemo(
    () => new Set(envois.map((e) => e.idvoit)).size,
    [envois],
  );

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      {/* =====================================================
          1. HEADER (BANNIÈRE MODERNE)
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <PackageOpen className="h-6 w-6" strokeWidth={2} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Gestion des envois
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Enregistrez et pilotez les expéditions de colis sur vos lignes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={ouvrirAjout}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
          >
            <Plus size={16} />
            <span>Ajouter un envoi</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          2. MESSAGE D'ERREUR
      ====================================================== */}
      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{error}</span>
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

      {/* =====================================================
          3. STATISTIQUES EN RUBAN (3 KPI CARDS)
      ====================================================== */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* TOTAL ENVOIS */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total envois
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-slate-900">
            {envois.length}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            Colis expédiés enregistrés
          </span>
        </div>

        {/* FLOTTE MOBILISÉE */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Véhicules mobilisés
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <Truck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-3xl font-black text-sky-600">
            {totalVehiculesUtilises}
          </p>
          <span className="mt-1 block text-xs text-slate-400">
            Voitures affectées aux envois
          </span>
        </div>

        {/* RECETTES DES ENVOIS */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total des frais perçus
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Coins className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-2 font-mono text-2xl font-black text-emerald-600">
            {formatMoney(totalFrais)}
          </p>
          <span className="mt-1 block text-xs font-medium text-emerald-700/80">
            Chiffre d'affaires des expéditions
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
            placeholder="Rechercher par colis, envoyeur, récepteur..."
            value={search}
            onChange={(e) => rechercher(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {search && (
            <button
              type="button"
              onClick={() => rechercher("")}
              className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X size={14} />
              Effacer filtre
            </button>
          )}
          <span className="text-xs text-slate-400">
            <strong className="text-slate-700 font-semibold">
              {envois.length}
            </strong>{" "}
            envois affichés
          </span>
        </div>
      </div>

      {/* =====================================================
          5. CHARGEMENT
      ====================================================== */}
      {loading && (
        <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <p className="text-xs text-slate-500">
            Chargement des expéditions...
          </p>
        </div>
      )}

      {/* =====================================================
          6. TABLEAU DES ENVOIS
      ====================================================== */}
      {!loading && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-5 py-4">Réf / Colis</th>
                  <th className="px-5 py-4">Expéditeur</th>
                  <th className="px-5 py-4">Destinataire</th>
                  <th className="px-5 py-4">Véhicule</th>
                  <th className="px-5 py-4">Itinéraire</th>
                  <th className="px-5 py-4">Date Envoi</th>
                  <th className="px-5 py-4">Frais</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-slate-700">
                {envois.map((envoi) => {
                  const voiture = envoi.voiture;
                  const itineraire = voiture?.itineraire;

                  return (
                    <tr
                      key={envoi.idenvoi}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      {/* COLIS & ID */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {envoi.colis}
                        </div>
                        <div className="font-mono text-xs text-blue-600 font-bold">
                          Envoi #{envoi.idenvoi}
                        </div>
                      </td>

                      {/* ENVOYEUR */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800">
                          {envoi.nomEnvoyeur}
                        </div>
                        {envoi.emailEnvoyeur && (
                          <div className="text-[11px] text-slate-400">
                            {envoi.emailEnvoyeur}
                          </div>
                        )}
                      </td>

                      {/* RECEPTEUR */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800">
                          {envoi.nomRecepteur}
                        </div>
                        {envoi.contactRecepteur && (
                          <div className="font-mono text-[11px] text-slate-500">
                            {envoi.contactRecepteur}
                          </div>
                        )}
                      </td>

                      {/* VOITURE */}
                      <td className="px-5 py-4">
                        {voiture ? (
                          <div>
                            <span className="font-semibold text-slate-800">
                              {voiture.idvoit}
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              {voiture.design}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* ITINERAIRE */}
                      <td className="px-5 py-4">
                        {itineraire ? (
                          <div>
                            <span className="font-bold text-indigo-600 text-xs">
                              {itineraire.codeit}
                            </span>
                            <span className="block text-[11px] text-slate-500">
                              {itineraire.villedep} → {itineraire.villearr}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* DATE */}
                      <td className="px-5 py-4 whitespace-nowrap text-slate-600 text-xs">
                        {formatDate(envoi.date_envoi)}
                      </td>

                      {/* FRAIS */}
                      <td className="px-5 py-4 font-mono font-bold text-slate-900">
                        {formatMoney(envoi.frais)}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* MODIFIER */}
                          <button
                            type="button"
                            onClick={() => ouvrirModification(envoi)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700 border border-amber-200/80 hover:bg-amber-100 transition-colors"
                            title="Modifier l'envoi"
                          >
                            <Pencil size={13} />
                            <span>Modifier</span>
                          </button>

                          {/* SUPPRIMER */}
                          <button
                            type="button"
                            onClick={() => setEnvoiToDelete(envoi)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 border border-red-200/80 hover:bg-red-100 transition-colors"
                            title="Supprimer l'envoi"
                          >
                            <Trash2 size={13} />
                            <span>Supprimer</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {envois.length === 0 && (
              <div className="p-12 text-center text-slate-400">
                <PackageOpen className="h-10 w-10 mx-auto mb-2 text-slate-300" />
                <p className="font-semibold text-slate-600">
                  Aucun envoi trouvé
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Aucun colis n'a été enregistré ou ne correspond à vos critères
                  de recherche.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          7. MODALE D'AJOUT / MODIFICATION D'UN ENVOI
      ========================================================================== */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header modale */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white">
                  <PackageOpen size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {editingId !== null
                      ? `Modifier l'envoi #${editingId}`
                      : "Nouvel envoi de colis"}
                  </h3>
                  <p className="text-xs text-blue-100">
                    Renseignez les détails du colis et des interlocuteurs
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFormModal(false)}
                className="cursor-pointer rounded-full p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Formulaire */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Véhicule */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Véhicule assigné <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="idvoit"
                    value={formData.idvoit}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">-- Sélectionner un véhicule --</option>
                    {voitures.map((v) => (
                      <option key={v.idvoit} value={v.idvoit}>
                        {v.idvoit} — {v.design}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nom du Colis */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Désignation du Colis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="colis"
                    placeholder="Ex: Carton pièces, Documents..."
                    value={formData.colis}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Nom Envoyeur */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Nom de l'envoyeur <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomEnvoyeur"
                    placeholder="Nom complet ou société"
                    value={formData.nomEnvoyeur}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Email Envoyeur */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Email de l'envoyeur
                  </label>
                  <input
                    type="email"
                    name="emailEnvoyeur"
                    placeholder="exemple@domaine.com"
                    value={formData.emailEnvoyeur}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Nom Récepteur */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Nom du destinataire (récepteur){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nomRecepteur"
                    placeholder="Nom complet du récepteur"
                    value={formData.nomRecepteur}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Contact Récepteur */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Contact du récepteur (Téléphone){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactRecepteur"
                    placeholder="+261 34 00 000 00"
                    value={formData.contactRecepteur}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 font-mono"
                  />
                </div>

                {/* Date Envoi */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Date et heure d'envoi{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="date_envoi"
                    value={formData.date_envoi}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                {/* Frais */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    Frais d'envoi (Ariary){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="frais"
                    placeholder="Ex: 25000"
                    value={formData.frais}
                    onChange={handleChange}
                    min="0"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setShowFormModal(false)}
                  className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>
                      {editingId !== null ? "Mettre à jour" : "Valider l'envoi"}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          8. BOÎTE DE DIALOGUE DE CONFIRMATION DE SUPPRESSION (MODAL SÉCURISÉ)
      ========================================================================== */}
      {envoiToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Alerte icône et titre */}
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Confirmer la suppression
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Cette action supprimera définitivement l'envoi et ses données
                  associées.
                </p>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="mt-4 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Envoi :</span>
                <span className="font-mono font-bold text-slate-800">
                  #{envoiToDelete.idenvoi}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Colis :</span>
                <span className="font-semibold text-slate-800">
                  {envoiToDelete.colis}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expéditeur :</span>
                <span className="font-semibold text-slate-800">
                  {envoiToDelete.nomEnvoyeur}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setEnvoiToDelete(null)}
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
    </div>
  );
}

export default Envois;
