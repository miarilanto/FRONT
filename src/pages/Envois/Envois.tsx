import { useEffect, useState } from "react";

import {
  getEnvois,
  rechercherEnvois,
  createEnvoi,
  updateEnvoi,
  deleteEnvoi,
} from "../../services/envoyer.services";

import { getVoitures } from "../../services/voiture.services";

function Envois() {
  const [envois, setEnvois] = useState<any[]>([]);
  const [voitures, setVoitures] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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
  // Charger les envois
  // ==========================================

  const chargerEnvois = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEnvois();

      setEnvois(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les envois.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Charger les voitures
  // ==========================================

  const chargerVoitures = async () => {
    try {
      const data = await getVoitures();

      setVoitures(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les voitures.");
    }
  };

  // ==========================================
  // Chargement initial
  // ==========================================

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
      setError("");

      const data = await rechercherEnvois(value);

      setEnvois(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la recherche.");
    }
  };

  // ==========================================
  // Gestion formulaire
  // ==========================================

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // Ouvrir ajout
  // ==========================================

  const ouvrirAjout = () => {
    setEditingId(null);

    setFormData({
      idvoit: "",
      colis: "",
      nomEnvoyeur: "",
      emailEnvoyeur: "",
      date_envoi: "",
      frais: "",
      nomRecepteur: "",
      contactRecepteur: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // Ouvrir modification
  // ==========================================

  const ouvrirModification = (envoi: any) => {
    setEditingId(envoi.idenvoi);

    setFormData({
      idvoit: envoi.idvoit,
      colis: envoi.colis,
      nomEnvoyeur: envoi.nomEnvoyeur,
      emailEnvoyeur: envoi.emailEnvoyeur,
      date_envoi: new Date(envoi.date_envoi)
        .toISOString()
        .slice(0, 16),
      frais: envoi.frais.toString(),
      nomRecepteur: envoi.nomRecepteur,
      contactRecepteur: envoi.contactRecepteur,
    });

    setShowForm(true);
  };

  // ==========================================
  // Enregistrer
  // ==========================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setError("");

      const data = {
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
        await updateEnvoi(editingId, data);
      } else {
        await createEnvoi(data);
      }

      setShowForm(false);

      await chargerEnvois();
    } catch (err) {
      console.error(err);
      setError("Impossible d'enregistrer l'envoi.");
    }
  };

  // ==========================================
  // Supprimer
  // ==========================================

  const supprimer = async (idenvoi: number) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cet envoi ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      setError("");

      await deleteEnvoi(idenvoi);

      await chargerEnvois();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer l'envoi.");
    }
  };

  return (
    <div>

      {/* ================= HEADER ================= */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Envois
          </h1>

          <p className="mt-1 text-slate-500">
            Gestion des colis envoyés.
          </p>
        </div>

        <button
          onClick={ouvrirAjout}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Ajouter un envoi
        </button>

      </div>

      {/* ================= ERREUR ================= */}

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* ================= RECHERCHE ================= */}

      <div className="mb-4">

        <input
          type="text"
          placeholder="Rechercher un envoi..."
          value={search}
          onChange={(e) => rechercher(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

      </div>

      {/* ================= FORMULAIRE ================= */}

      {showForm && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-semibold text-slate-800">
            {editingId !== null
              ? "Modifier l'envoi"
              : "Ajouter un envoi"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >

            {/* ================= VOITURE ================= */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Voiture
              </label>

              <select
                name="idvoit"
                value={formData.idvoit}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2"
              >

                <option value="">
                  -- Sélectionner une voiture --
                </option>

                {voitures.map((voiture) => (
                  <option
                    key={voiture.idvoit}
                    value={voiture.idvoit}
                  >
                    {voiture.idvoit} - {voiture.design}
                  </option>
                ))}

              </select>
            </div>

            {/* ================= COLIS ================= */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Colis
              </label>

              <input
                type="text"
                name="colis"
                value={formData.colis}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* ================= ENVOYEUR ================= */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Nom de l'envoyeur
              </label>

              <input
                type="text"
                name="nomEnvoyeur"
                value={formData.nomEnvoyeur}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* ================= EMAIL ================= */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Email de l'envoyeur
              </label>

              <input
                type="email"
                name="emailEnvoyeur"
                value={formData.emailEnvoyeur}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* ================= DATE ================= */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Date d'envoi
              </label>

              <input
                type="datetime-local"
                name="date_envoi"
                value={formData.date_envoi}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* ================= FRAIS ================= */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Frais
              </label>

              <input
                type="number"
                name="frais"
                value={formData.frais}
                onChange={handleChange}
                min="0"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* ================= RECEPTEUR ================= */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Nom du récepteur
              </label>

              <input
                type="text"
                name="nomRecepteur"
                value={formData.nomRecepteur}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* ================= CONTACT ================= */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Contact du récepteur
              </label>

              <input
                type="text"
                name="contactRecepteur"
                value={formData.contactRecepteur}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* ================= BOUTONS ================= */}

            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
              >
                {editingId !== null
                  ? "Modifier"
                  : "Ajouter"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg bg-slate-200 px-5 py-2 font-medium text-slate-700 hover:bg-slate-300"
              >
                Annuler
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ================= CHARGEMENT ================= */}

      {loading && (
        <p className="text-slate-500">
          Chargement des envois...
        </p>
      )}

      {/* ================= TABLE ================= */}

      {!loading && (
        <div className="overflow-x-auto rounded-xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  ID
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Colis
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Envoyeur
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Récepteur
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Voiture
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Itinéraire
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Frais
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-200">

              {envois.map((envoi) => (

                <tr
                  key={envoi.idenvoi}
                  className="hover:bg-slate-50"
                >

                  {/* ID */}

                  <td className="px-6 py-4 font-medium text-slate-800">
                    {envoi.idenvoi}
                  </td>

                  {/* COLIS */}

                  <td className="px-6 py-4">
                    {envoi.colis}
                  </td>

                  {/* ENVOYEUR */}

                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {envoi.nomEnvoyeur}
                    </div>

                    <div className="text-sm text-slate-500">
                      {envoi.emailEnvoyeur}
                    </div>
                  </td>

                  {/* RECEPTEUR */}

                  <td className="px-6 py-4">
                    <div className="font-medium">
                      {envoi.nomRecepteur}
                    </div>

                    <div className="text-sm text-slate-500">
                      {envoi.contactRecepteur}
                    </div>
                  </td>

                  {/* VOITURE */}

                  <td className="px-6 py-4">

                    <div className="font-medium text-slate-800">
                      {envoi.voiture?.idvoit}
                    </div>

                    <div className="text-sm text-slate-500">
                      {envoi.voiture?.design}
                    </div>

                  </td>

                  {/* ITINERAIRE */}

                  <td className="px-6 py-4">

                    <div className="font-medium text-slate-800">
                      {envoi.voiture?.itineraire?.codeit}
                    </div>

                    <div className="text-sm text-slate-500">
                      {envoi.voiture?.itineraire?.villedep}
                      {" → "}
                      {envoi.voiture?.itineraire?.villearr}
                    </div>

                  </td>

                  {/* FRAIS */}

                  <td className="px-6 py-4">
                    {envoi.frais}
                  </td>

                  {/* ACTIONS */}

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          ouvrirModification(envoi)
                        }
                        className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-200"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() =>
                          supprimer(envoi.idenvoi)
                        }
                        className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                      >
                        Supprimer
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {envois.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Aucun envoi trouvé.
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Envois;