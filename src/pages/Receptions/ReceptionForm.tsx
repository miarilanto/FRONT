import React, { useState } from "react";
import { receptionService } from "../../services/receptionService";

interface ReceptionFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const ReceptionForm: React.FC<ReceptionFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [idenvoi, setIdenvoi] = useState("");
  const [dateRecept, setDateRecept] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    if (!idenvoi.trim()) {
      setError("L'ID de l'envoi est obligatoire.");
      return;
    }

    if (!dateRecept) {
      setError("La date de réception est obligatoire.");
      return;
    }

    try {
      setLoading(true);

      await receptionService.create({
        idenvoi: Number(idenvoi),
        date_recept: dateRecept,
      });

      setIdenvoi("");
      setDateRecept("");

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'ajout de la réception.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body p-0">
          {/* =====================================
              TITRE
          ====================================== */}
          <div className="p-5 border-b border-base-200">
            <h2 className="card-title text-xl">Ajouter une réception</h2>

            <p className="text-sm opacity-60 mt-1">
              Enregistrer la réception d'un colis envoyé.
            </p>
          </div>

          {/* =====================================
              ERREUR
          ====================================== */}
          {error && (
            <div className="px-5 pt-5">
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* =====================================
              TABLE FORMULAIRE
          ====================================== */}
          <div className="overflow-x-auto p-5">
            <table className="table">
              {/* HEAD */}
              <thead>
                <tr>
                  <th>#</th>
                  <th>Champ</th>
                  <th>Description</th>
                  <th>Valeur</th>
                </tr>
              </thead>

              <tbody>
                {/* =================================
                    ID ENVOI
                ================================== */}
                <tr>
                  <th>
                    <div className="badge badge-primary badge-lg">01</div>
                  </th>

                  <td>
                    <div className="font-bold">ID de l'envoi</div>

                    <div className="text-xs opacity-50">Identifiant</div>
                  </td>

                  <td>
                    <span className="text-sm opacity-70">
                      Identifiant du colis à réceptionner
                    </span>
                  </td>

                  <td>
                    <input
                      type="number"
                      min="1"
                      placeholder="Ex : 1"
                      className="input input-bordered w-64"
                      value={idenvoi}
                      onChange={(e) => setIdenvoi(e.target.value)}
                      disabled={loading}
                    />
                  </td>
                </tr>

                {/* =================================
                    DATE RECEPTION
                ================================== */}
                <tr>
                  <th>
                    <div className="badge badge-info badge-lg">02</div>
                  </th>

                  <td>
                    <div className="font-bold">Date de réception</div>

                    <div className="text-xs opacity-50">Date</div>
                  </td>

                  <td>
                    <span className="text-sm opacity-70">
                      Date à laquelle le colis est réceptionné
                    </span>
                  </td>

                  <td>
                    <input
                      type="date"
                      className="input input-bordered w-64"
                      value={dateRecept}
                      onChange={(e) => setDateRecept(e.target.value)}
                      disabled={loading}
                    />
                  </td>
                </tr>
              </tbody>

              {/* FOOT */}
              <tfoot>
                <tr>
                  <th></th>
                  <th>Champ</th>
                  <th>Description</th>
                  <th>Valeur</th>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* =====================================
              ACTIONS
          ====================================== */}
          <div className="border-t border-base-200 p-5">
            <div className="flex justify-end gap-3">
              {onCancel && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Annuler
                </button>
              )}

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Enregistrement...
                  </>
                ) : (
                  <>Enregistrer</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ReceptionForm;
