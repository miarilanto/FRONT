import { useEffect, useState } from "react";
import {
  getVoitures,
  rechercherVoitures,
  createVoiture,
  updateVoiture,
  deleteVoiture,
} from "../../services/voiture.services";

import { getAllItineraires } from "../../services/itineraireApi";

function Voitures() {
  const [voitures, setVoitures] = useState<any[]>([]);
  const [itineraires, setItineraires] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    idvoit: "",
    design: "",
    codeit: "",
    frais: "",
  });

  // ==========================================
  // Charger les voitures
  // ==========================================

  const chargerVoitures = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getVoitures();
      setVoitures(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les voitures.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Charger les itinéraires
  // ==========================================

  const chargerItineraires = async () => {
  try {
    const data = await getAllItineraires();
    setItineraires(data);
  } catch (err) {
    console.error(err);
    setError("Impossible de charger les itinéraires.");
  }
};

  // ==========================================
  // Chargement initial
  // ==========================================

  useEffect(() => {
    chargerVoitures();
    chargerItineraires();
  }, []);

  // ==========================================
  // Recherche
  // ==========================================

  const rechercher = async (value: string) => {
    setSearch(value);

    if (value.trim() === "") {
      chargerVoitures();
      return;
    }

    try {
      setError("");

      const data = await rechercherVoitures(value);
      setVoitures(data);
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
  // Ouvrir formulaire ajout
  // ==========================================

  const ouvrirAjout = () => {
    setEditingId(null);

    setFormData({
      idvoit: "",
      design: "",
      codeit: "",
      frais: "",
    });

    setShowForm(true);
  };

  // ==========================================
  // Ouvrir formulaire modification
  // ==========================================

  const ouvrirModification = (voiture: any) => {
    setEditingId(voiture.idvoit);

    setFormData({
      idvoit: voiture.idvoit,
      design: voiture.design,
      codeit: voiture.codeit,
      frais: voiture.frais.toString(),
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

      if (editingId) {
        await updateVoiture(editingId, {
          design: formData.design,
          codeit: formData.codeit,
          frais: Number(formData.frais),
        });
      } else {
        await createVoiture({
          idvoit: formData.idvoit,
          design: formData.design,
          codeit: formData.codeit,
          frais: Number(formData.frais),
        });
      }

      setShowForm(false);

      await chargerVoitures();
    } catch (err) {
      console.error(err);
      setError("Impossible d'enregistrer la voiture.");
    }
  };

  // ==========================================
  // Supprimer
  // ==========================================

  const supprimer = async (idvoit: string) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette voiture ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      setError("");

      await deleteVoiture(idvoit);

      await chargerVoitures();
    } catch (err) {
      console.error(err);
      setError("Impossible de supprimer la voiture.");
    }
  };

  return (
    <div>

      {/* ================= HEADER ================= */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Voitures
          </h1>

          <p className="mt-1 text-slate-500">
            Gestion des voitures utilisées pour les itinéraires.
          </p>
        </div>

        <button
          onClick={ouvrirAjout}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          + Ajouter une voiture
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
          placeholder="Rechercher une voiture..."
          value={search}
          onChange={(e) => rechercher(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* ================= FORMULAIRE ================= */}

      {showForm && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow">

          <h2 className="mb-5 text-xl font-semibold text-slate-800">
            {editingId
              ? "Modifier la voiture"
              : "Ajouter une voiture"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >

            {/* ID */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                ID voiture
              </label>

              <input
                type="text"
                name="idvoit"
                value={formData.idvoit}
                onChange={handleChange}
                disabled={!!editingId}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2 disabled:bg-slate-100"
              />
            </div>

            {/* Désignation */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Désignation
              </label>

              <input
                type="text"
                name="design"
                value={formData.design}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* Itinéraire */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Itinéraire
              </label>

              <select
                name="codeit"
                value={formData.codeit}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2"
              >
                <option value="">
                  -- Sélectionner un itinéraire --
                </option>

                {itineraires.map((itineraire) => (
                  <option
                    key={itineraire.codeit}
                    value={itineraire.codeit}
                  >
                    {itineraire.codeit} - {itineraire.villedep} →{" "}
                    {itineraire.villearr}
                  </option>
                ))}
              </select>
            </div>

            {/* Frais */}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-600">
                Frais
              </label>

              <input
                type="number"
                name="frais"
                value={formData.frais}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>

            {/* Boutons */}

            <div className="flex gap-3 md:col-span-2">

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
              >
                {editingId ? "Modifier" : "Ajouter"}
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
          Chargement des voitures...
        </p>
      )}

      {/* ================= TABLE ================= */}

      {!loading && (
        <div className="overflow-hidden rounded-xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  ID
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                  Désignation
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

              {voitures.map((voiture) => (

                <tr
                  key={voiture.idvoit}
                  className="hover:bg-slate-50"
                >

                  <td className="px-6 py-4 font-medium text-slate-800">
                    {voiture.idvoit}
                  </td>

                  <td className="px-6 py-4">
                    {voiture.design}
                  </td>

                  {/* ITINÉRAIRE */}

                  <td className="px-6 py-4">

                    <div className="font-medium text-slate-800">
                      {voiture.itineraire?.codeit}
                    </div>

                    <div className="text-sm text-slate-500">
                      {voiture.itineraire?.villedep} →{" "}
                      {voiture.itineraire?.villearr}
                    </div>

                  </td>

                  <td className="px-6 py-4">
                    {voiture.frais}
                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          ouvrirModification(voiture)
                        }
                        className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-200"
                      >
                        Modifier
                      </button>

                      <button
                        onClick={() =>
                          supprimer(voiture.idvoit)
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

          {/* Aucun résultat */}

          {voitures.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              Aucune voiture trouvée.
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default Voitures;