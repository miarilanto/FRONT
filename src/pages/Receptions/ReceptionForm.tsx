// import React, { useState } from "react";
// import { receptionService } from "../../services/receptionService";

// interface ReceptionFormProps {
//   onSuccess: () => void;
//   onCancel?: () => void;
// }

// const ReceptionForm: React.FC<ReceptionFormProps> = ({
//   onSuccess,
//   onCancel,
// }) => {
//   const [idenvoi, setIdenvoi] = useState("");
//   const [dateRecept, setDateRecept] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     setError(null);

//     if (!idenvoi.trim()) {
//       setError("L'ID de l'envoi est obligatoire.");
//       return;
//     }

//     if (!dateRecept) {
//       setError("La date de réception est obligatoire.");
//       return;
//     }

//     try {
//       setLoading(true);

//       await receptionService.create({
//         idenvoi: Number(idenvoi),
//         date_recept: dateRecept,
//       });

//       setIdenvoi("");
//       setDateRecept("");

//       onSuccess();
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Erreur lors de l'ajout de la réception.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="card bg-base-100 shadow-xl border border-base-200">
//         <div className="card-body p-0">
//           {/* =====================================
//               TITRE
//           ====================================== */}
//           <div className="p-5 border-b border-base-200">
//             <h2 className="card-title text-xl">Ajouter une réception</h2>

//             <p className="text-sm opacity-60 mt-1">
//               Enregistrer la réception d'un colis envoyé.
//             </p>
//           </div>

//           {/* =====================================
//               ERREUR
//           ====================================== */}
//           {error && (
//             <div className="px-5 pt-5">
//               <div className="alert alert-error">
//                 <span>{error}</span>
//               </div>
//             </div>
//           )}

//           {/* =====================================
//               TABLE FORMULAIRE
//           ====================================== */}
//           <div className="overflow-x-auto p-5">
//             <table className="table">
//               {/* HEAD */}
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Champ</th>
//                   <th>Description</th>
//                   <th>Valeur</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {/* =================================
//                     ID ENVOI
//                 ================================== */}
//                 <tr>
//                   <th>
//                     <div className="badge badge-primary badge-lg">01</div>
//                   </th>

//                   <td>
//                     <div className="font-bold">ID de l'envoi</div>

//                     <div className="text-xs opacity-50">Identifiant</div>
//                   </td>

//                   <td>
//                     <span className="text-sm opacity-70">
//                       Identifiant du colis à réceptionner
//                     </span>
//                   </td>

//                   <td>
//                     <input
//                       type="number"
//                       min="1"
//                       placeholder="Ex : 1"
//                       className="input input-bordered w-64"
//                       value={idenvoi}
//                       onChange={(e) => setIdenvoi(e.target.value)}
//                       disabled={loading}
//                     />
//                   </td>
//                 </tr>

//                 {/* =================================
//                     DATE RECEPTION
//                 ================================== */}
//                 <tr>
//                   <th>
//                     <div className="badge badge-info badge-lg">02</div>
//                   </th>

//                   <td>
//                     <div className="font-bold">Date de réception</div>

//                     <div className="text-xs opacity-50">Date</div>
//                   </td>

//                   <td>
//                     <span className="text-sm opacity-70">
//                       Date à laquelle le colis est réceptionné
//                     </span>
//                   </td>

//                   <td>
//                     <input
//                       type="date"
//                       className="input input-bordered w-64"
//                       value={dateRecept}
//                       onChange={(e) => setDateRecept(e.target.value)}
//                       disabled={loading}
//                     />
//                   </td>
//                 </tr>
//               </tbody>

//               {/* FOOT */}
//               <tfoot>
//                 <tr>
//                   <th></th>
//                   <th>Champ</th>
//                   <th>Description</th>
//                   <th>Valeur</th>
//                 </tr>
//               </tfoot>
//             </table>
//           </div>

//           {/* =====================================
//               ACTIONS
//           ====================================== */}
//           <div className="border-t border-base-200 p-5">
//             <div className="flex justify-end gap-3">
//               {onCancel && (
//                 <button
//                   type="button"
//                   className="btn btn-ghost"
//                   onClick={onCancel}
//                   disabled={loading}
//                 >
//                   Annuler
//                 </button>
//               )}

//               <button
//                 type="submit"
//                 className="btn btn-primary"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <span className="loading loading-spinner loading-sm"></span>
//                     Enregistrement...
//                   </>
//                 ) : (
//                   <>Enregistrer</>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default ReceptionForm;

import React, { useState } from "react";
import { PackageCheck, CalendarDays, Hash, X } from "lucide-react";

import { receptionService } from "../../services/receptionService";

interface ReceptionFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const ReceptionForm: React.FC<ReceptionFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  // ======================================================
  // ÉTATS
  // ======================================================

  const [idenvoi, setIdenvoi] = useState("");
  const [dateRecept, setDateRecept] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // SOUMISSION
  // ======================================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    // Vérification ID envoi
    if (!idenvoi.trim()) {
      setError("L'ID de l'envoi est obligatoire.");
      return;
    }

    // Vérification date
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

      // Réinitialisation
      setIdenvoi("");
      setDateRecept("");

      // Notification au parent
      onSuccess();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Erreur lors de l'ajout de la réception.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // RENDU
  // ======================================================

  return (
    <div className="mb-6 rounded-xl bg-white shadow">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
            <PackageCheck className="h-6 w-6" strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              Ajouter une réception
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enregistrer la réception d'un colis envoyé.
            </p>
          </div>
        </div>
      </div>

      {/* ==================================================
          ERREUR
      ================================================== */}

      {error && (
        <div className="px-6 pt-5">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <div className="flex items-center gap-2">
              <span className="font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          FORMULAIRE
      ================================================== */}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          {/* ==================================================
              ID ENVOI
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              ID de l'envoi
            </label>

            <div className="relative">
              <Hash className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="number"
                min="1"
                placeholder="Ex : 1"
                value={idenvoi}
                onChange={(e) => setIdenvoi(e.target.value)}
                disabled={loading}
                required
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
              />
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Identifiant du colis à réceptionner.
            </p>
          </div>

          {/* ==================================================
              DATE RÉCEPTION
          ================================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Date de réception
            </label>

            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

              <input
                type="date"
                value={dateRecept}
                onChange={(e) => setDateRecept(e.target.value)}
                disabled={loading}
                required
                className="w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 disabled:bg-slate-100"
              />
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Date à laquelle le colis est réceptionné.
            </p>
          </div>
        </div>

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          {/* ANNULER */}

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg bg-slate-200 px-5 py-2 font-medium text-slate-700 transition hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Annuler
              </span>
            </button>
          )}

          {/* ENREGISTRER */}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Enregistrement...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <PackageCheck className="h-4 w-4" />
                Enregistrer
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReceptionForm;