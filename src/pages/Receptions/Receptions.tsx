// import React, { useEffect, useState } from "react";
// import { Plus, Search, X, PackageCheck, CalendarCheck } from "lucide-react";

// import { receptionService } from "../../services/receptionService";

// import type { Reception } from "./types";

// import ReceptionForm from "./ReceptionForm";
// import ReceptionDetails from "./ReceptionDetails";

// const Receptions: React.FC = () => {
//   const [receptions, setReceptions] = useState<Reception[]>([]);

//   const [loading, setLoading] = useState(true);

//   const [error, setError] = useState<string | null>(null);

//   const [search, setSearch] = useState("");

//   const [selectedReception, setSelectedReception] = useState<Reception | null>(
//     null,
//   );

//   // ==========================================
//   // Charger toutes les réceptions
//   // ==========================================

//   const loadReceptions = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const data = await receptionService.getAll();

//       setReceptions(data);
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Impossible de récupérer les réceptions.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==========================================
//   // Chargement initial
//   // ==========================================

//   useEffect(() => {
//     loadReceptions();
//   }, []);

//   // ==========================================
//   // Recherche automatique
//   // ==========================================

//   useEffect(() => {
//     // Ne pas lancer une recherche immédiatement
//     // lorsque le composant vient d'être chargé.
//     if (!search.trim()) {
//       return;
//     }

//     const timer = setTimeout(async () => {
//       const terme = search.trim();

//       try {
//         setLoading(true);
//         setError(null);

//         const data = await receptionService.rechercher(terme);

//         setReceptions(data);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "Erreur lors de la recherche.",
//         );
//       } finally {
//         setLoading(false);
//       }
//     }, 300);

//     // Annuler le timer précédent si l'utilisateur
//     // continue à écrire.
//     return () => {
//       clearTimeout(timer);
//     };
//   }, [search]);

//   // ==========================================
//   // Effacer recherche
//   // ==========================================

//   const clearSearch = () => {
//     setSearch("");
//     loadReceptions();
//   };

//   // ==========================================
//   // Supprimer une réception
//   // ==========================================

//   const handleDelete = async (id: number) => {
//     const confirmation = window.confirm(
//       "Voulez-vous vraiment supprimer cette réception ?",
//     );

//     if (!confirmation) {
//       return;
//     }

//     try {
//       await receptionService.remove(id);

//       setReceptions((previous) =>
//         previous.filter((reception) => reception.idrecept !== id),
//       );
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Erreur lors de la suppression.",
//       );
//     }
//   };

//   // ==========================================
//   // Format date
//   // ==========================================

//   const formatDate = (date: string) => {
//     const parsedDate = new Date(date);

//     if (isNaN(parsedDate.getTime())) {
//       return date;
//     }

//     return parsedDate.toLocaleDateString("fr-FR");
//   };

//   // ==========================================
//   // Chargement initial
//   // ==========================================

//   if (loading && receptions.length === 0 && !search) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="flex flex-col items-center gap-3">
//           <span className="loading loading-spinner loading-lg text-primary"></span>

//           <p className="text-base-content/60">Chargement des réceptions...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">
//       {/* ======================================
//           HEADER
//       ====================================== */}

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
//         <div>
//           <h1 className="text-3xl font-bold">Réceptions</h1>

//           <p className="text-base-content/60 mt-1">
//             Gestion des colis réceptionnés
//           </p>
//         </div>

//         <button
//           type="button"
//           className="
//             btn
//             btn-primary
//             gap-2
//             shadow-md
//             hover:shadow-lg
//             transition-all
//             duration-200
//           "
//           onClick={() =>
//             document.getElementById("modal-ajout-reception")?.showModal()
//           }
//         >
//           <Plus size={18} />
//           Nouvelle réception
//         </button>
//       </div>

//       {/* ======================================
//           ERREUR
//       ====================================== */}

//       {error && (
//         <div className="alert alert-error mb-6">
//           <span>{error}</span>

//           <button className="btn btn-sm" onClick={() => setError(null)}>
//             Fermer
//           </button>
//         </div>
//       )}

//       {/* ======================================
//           STATISTIQUES
//       ====================================== */}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
//         {/* Total réceptions */}

//         <div className="card bg-base-100 shadow-md">
//           <div className="card-body">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-sm text-base-content/60">
//                   Total réceptions
//                 </div>

//                 <div className="text-3xl font-bold text-primary mt-1">
//                   {receptions.length}
//                 </div>

//                 <div className="text-sm text-base-content/60 mt-1">
//                   Réceptions enregistrées
//                 </div>
//               </div>

//               <div className="p-3 rounded-full bg-primary/10">
//                 <PackageCheck size={28} className="text-primary" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Réceptions aujourd'hui */}

//         <div className="card bg-base-100 shadow-md">
//           <div className="card-body">
//             <div className="flex items-center justify-between">
//               <div>
//                 <div className="text-sm text-base-content/60">
//                   Réceptions aujourd'hui
//                 </div>

//                 <div className="text-3xl font-bold text-success mt-1">
//                   {
//                     receptions.filter((reception) => {
//                       const today = new Date().toDateString();

//                       return (
//                         new Date(reception.date_recept).toDateString() === today
//                       );
//                     }).length
//                   }
//                 </div>

//                 <div className="text-sm text-base-content/60 mt-1">
//                   Colis réceptionnés
//                 </div>
//               </div>

//               <div className="p-3 rounded-full bg-success/10">
//                 <CalendarCheck size={28} className="text-success" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ======================================
//           RECHERCHE AUTOMATIQUE
//       ====================================== */}

//       <div className="card bg-base-100 shadow-md mb-6">
//         <div className="card-body">
//           <div className="flex flex-col md:flex-row gap-3">
//             {/* Champ de recherche */}

//             <label className="input input-bordered flex flex-1 items-center gap-2">
//               <Search size={18} className="text-base-content/60 shrink-0" />

//               <input
//                 type="text"
//                 placeholder="Rechercher par ID, colis, envoyeur, récepteur, voiture..."
//                 className="grow"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />

//               {/* Loading pendant la recherche */}

//               {loading && search.trim() && (
//                 <span className="loading loading-spinner loading-sm"></span>
//               )}
//             </label>

//             {/* Effacer */}

//             {search && (
//               <button
//                 type="button"
//                 className="btn btn-ghost gap-2"
//                 onClick={clearSearch}
//               >
//                 <X size={18} />
//                 Effacer
//               </button>
//             )}
//           </div>

//           {/* Indication */}

//           {search.trim() && (
//             <div className="text-sm text-base-content/60 mt-2">
//               Recherche pour :
//               <span className="font-semibold ml-1">"{search}"</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ======================================
//           TABLEAU
//       ====================================== */}

//       <div className="card bg-base-100 shadow-xl">
//         <div className="card-body p-0">
//           <div className="overflow-x-auto">
//             <table className="table table-zebra">
//               <thead>
//                 <tr>
//                   <th>ID</th>

//                   <th>Envoi</th>

//                   <th>Colis</th>

//                   <th>Envoyeur</th>

//                   <th>Récepteur</th>

//                   <th>Voiture</th>

//                   <th>Itinéraire</th>

//                   <th>Date</th>

//                   <th>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {receptions.length === 0 ? (
//                   <tr>
//                     <td colSpan={9} className="text-center py-12">
//                       <div className="flex flex-col items-center gap-3">
//                         <div className="text-5xl">📦</div>

//                         <p className="font-semibold">Aucune réception</p>

//                         <p className="text-sm text-base-content/60">
//                           Aucune réception ne correspond à votre recherche.
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : (
//                   receptions.map((reception) => {
//                     const envoyer = reception.envoyer;

//                     const voiture = envoyer?.voiture;

//                     const itineraire = voiture?.itineraire;

//                     return (
//                       <tr key={reception.idrecept}>
//                         {/* ID */}

//                         <td>
//                           <span className="badge badge-neutral">
//                             #{reception.idrecept}
//                           </span>
//                         </td>

//                         {/* ENVOI */}

//                         <td>
//                           <span className="badge badge-info badge-outline">
//                             #{reception.idenvoi}
//                           </span>
//                         </td>

//                         {/* COLIS */}

//                         <td>
//                           <span className="font-medium">
//                             {envoyer?.colis || "-"}
//                           </span>
//                         </td>

//                         {/* ENVOYEUR */}

//                         <td>{envoyer?.nomEnvoyeur || "-"}</td>

//                         {/* RECEPTEUR */}

//                         <td>
//                           <div>
//                             <p className="font-medium">
//                               {envoyer?.nomRecepteur || "-"}
//                             </p>

//                             {envoyer?.contactRecepteur && (
//                               <p className="text-xs text-base-content/60">
//                                 {envoyer.contactRecepteur}
//                               </p>
//                             )}
//                           </div>
//                         </td>

//                         {/* VOITURE */}

//                         <td>
//                           {voiture ? (
//                             <div>
//                               <p className="font-semibold">{voiture.idvoit}</p>

//                               <p className="text-xs text-base-content/60">
//                                 {voiture.design}
//                               </p>
//                             </div>
//                           ) : (
//                             <span className="text-base-content/50">-</span>
//                           )}
//                         </td>

//                         {/* ITINERAIRE */}

//                         <td>
//                           {itineraire ? (
//                             <div>
//                               <p className="font-semibold">
//                                 {itineraire.codeit}
//                               </p>

//                               <p className="text-xs">
//                                 {itineraire.villedep}

//                                 {" → "}

//                                 {itineraire.villearr}
//                               </p>
//                             </div>
//                           ) : (
//                             <span className="text-base-content/50">-</span>
//                           )}
//                         </td>

//                         {/* DATE */}

//                         <td>
//                           <span className="whitespace-nowrap">
//                             {formatDate(reception.date_recept)}
//                           </span>
//                         </td>

//                         {/* ACTIONS */}

//                         <td>
//                           <div className="flex gap-2">
//                             <button
//                               type="button"
//                               className="btn btn-sm btn-info"
//                               onClick={() => setSelectedReception(reception)}
//                             >
//                               Voir
//                             </button>

//                             <button
//                               type="button"
//                               className="btn btn-sm btn-error"
//                               onClick={() => handleDelete(reception.idrecept)}
//                             >
//                               Supprimer
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* ======================================
//           MODAL AJOUT
//       ====================================== */}

//       <dialog id="modal-ajout-reception" className="modal">
//         <div className="modal-box">
//           <h3 className="font-bold text-2xl mb-2">Nouvelle réception</h3>

//           <p className="text-base-content/60 mb-6">
//             Enregistrer la réception d'un colis.
//           </p>

//           <ReceptionForm
//             onSuccess={() => {
//               document.getElementById("modal-ajout-reception")?.close();

//               // Recharger les données après ajout
//               loadReceptions();
//             }}
//             onCancel={() => {
//               document.getElementById("modal-ajout-reception")?.close();
//             }}
//           />
//         </div>

//         <form method="dialog" className="modal-backdrop">
//           <button>close</button>
//         </form>
//       </dialog>

//       {/* ======================================
//           DETAILS
//       ====================================== */}

//       <ReceptionDetails
//         reception={selectedReception}
//         onClose={() => setSelectedReception(null)}
//       />
//     </div>
//   );
// };

// export default Receptions;

import React, { useEffect, useState } from "react";
import { Plus, Search, X, PackageCheck, CalendarCheck } from "lucide-react";

import { receptionService } from "../../services/receptionService";

import type { Reception } from "./types";

import ReceptionForm from "./ReceptionForm";
import ReceptionDetails from "./ReceptionDetails";

const Receptions: React.FC = () => {
  const [receptions, setReceptions] = useState<Reception[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");

  const [selectedReception, setSelectedReception] = useState<Reception | null>(
    null,
  );

  // ==========================================
  // Charger toutes les réceptions
  // ==========================================

  const loadReceptions = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await receptionService.getAll();

      setReceptions(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible de récupérer les réceptions.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Chargement initial
  // ==========================================

  useEffect(() => {
    loadReceptions();
  }, []);

  // ==========================================
  // Recherche automatique
  // ==========================================

  useEffect(() => {
    if (!search.trim()) {
      return;
    }

    const timer = setTimeout(async () => {
      const terme = search.trim();

      try {
        setLoading(true);
        setError(null);

        const data = await receptionService.rechercher(terme);

        setReceptions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erreur lors de la recherche.",
        );
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // ==========================================
  // Effacer recherche
  // ==========================================

  const clearSearch = () => {
    setSearch("");
    loadReceptions();
  };

  // ==========================================
  // Supprimer une réception
  // ==========================================

  const handleDelete = async (id: number) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette réception ?",
    );

    if (!confirmation) {
      return;
    }

    try {
      await receptionService.remove(id);

      setReceptions((previous) =>
        previous.filter((reception) => reception.idrecept !== id),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de la suppression.",
      );
    }
  };

  // ==========================================
  // Format date
  // ==========================================

  const formatDate = (date: string) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("fr-FR");
  };

  // ==========================================
  // Chargement initial
  // ==========================================

  if (loading && receptions.length === 0 && !search) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <span className="loading loading-spinner loading-lg text-primary" />

          <p className="text-base-content/60">Chargement des réceptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Réceptions</h1>

          <p className="text-base-content/60 mt-1">
            Gestion des colis réceptionnés
          </p>
        </div>

        <button
          type="button"
          className="
            btn
            btn-primary
            gap-2
            shadow-md
            hover:shadow-lg
            transition-all
            duration-200
          "
          onClick={() =>
            document.getElementById("modal-ajout-reception")?.showModal()
          }
        >
          <Plus size={18} />
          Nouvelle réception
        </button>
      </div>

      {/* ======================================
          ERREUR
      ====================================== */}

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>

          <button className="btn btn-sm" onClick={() => setError(null)}>
            Fermer
          </button>
        </div>
      )}

      {/* ======================================
          STATISTIQUES
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
        {/* Total réceptions */}

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-base-content/60">
                  Total réceptions
                </div>

                <div className="text-3xl font-bold text-primary mt-1">
                  {receptions.length}
                </div>

                <div className="text-sm text-base-content/60 mt-1">
                  Réceptions enregistrées
                </div>
              </div>

              <div className="p-3 rounded-full bg-primary/10">
                <PackageCheck size={28} className="text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Réceptions aujourd'hui */}

        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-base-content/60">
                  Réceptions aujourd'hui
                </div>

                <div className="text-3xl font-bold text-success mt-1">
                  {
                    receptions.filter((reception) => {
                      const today = new Date().toDateString();

                      return (
                        new Date(reception.date_recept).toDateString() === today
                      );
                    }).length
                  }
                </div>

                <div className="text-sm text-base-content/60 mt-1">
                  Colis réceptionnés
                </div>
              </div>

              <div className="p-3 rounded-full bg-success/10">
                <CalendarCheck size={28} className="text-success" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================
          RECHERCHE
      ====================================== */}

      <div className="card bg-base-100 shadow-md mb-6">
        <div className="card-body">
          <div className="flex flex-col md:flex-row gap-3">
            <label className="input input-bordered flex flex-1 items-center gap-2">
              <Search size={18} className="text-base-content/60 shrink-0" />

              <input
                type="text"
                placeholder="Rechercher par colis, envoyeur, récepteur, voiture..."
                className="grow"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {loading && search.trim() && (
                <span className="loading loading-spinner loading-sm" />
              )}
            </label>

            {search && (
              <button
                type="button"
                className="btn btn-ghost gap-2"
                onClick={clearSearch}
              >
                <X size={18} />
                Effacer
              </button>
            )}
          </div>

          {search.trim() && (
            <div className="text-sm text-base-content/60 mt-2">
              Recherche pour :
              <span className="font-semibold ml-1">"{search}"</span>
            </div>
          )}
        </div>
      </div>

      {/* ======================================
          TABLEAU
      ====================================== */}

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              {/* HEAD */}

              <thead>
                <tr>
                  <th>Colis</th>
                  <th>Envoyeur</th>
                  <th>Récepteur</th>
                  <th>Voiture</th>
                  <th>Itinéraire</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              {/* BODY */}

              <tbody>
                {receptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <div className="text-5xl">📦</div>

                        <p className="font-semibold">Aucune réception</p>

                        <p className="text-sm text-base-content/60">
                          Aucune réception ne correspond à votre recherche.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  receptions.map((reception) => {
                    const envoyer = reception.envoyer;

                    const voiture = envoyer?.voiture;

                    const itineraire = voiture?.itineraire;

                    return (
                      <tr key={reception.idrecept}>
                        {/* COLIS */}

                        <td>
                          <span className="font-medium">
                            {envoyer?.colis || "-"}
                          </span>
                        </td>

                        {/* ENVOYEUR */}

                        <td>{envoyer?.nomEnvoyeur || "-"}</td>

                        {/* RECEPTEUR */}

                        <td>
                          <div>
                            <p className="font-medium">
                              {envoyer?.nomRecepteur || "-"}
                            </p>

                            {envoyer?.contactRecepteur && (
                              <p className="text-xs text-base-content/60">
                                {envoyer.contactRecepteur}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* VOITURE */}

                        <td>
                          {voiture ? (
                            <div>
                              <p className="font-semibold">{voiture.design}</p>
                            </div>
                          ) : (
                            <span className="text-base-content/50">-</span>
                          )}
                        </td>

                        {/* ITINERAIRE */}

                        <td>
                          {itineraire ? (
                            <div>
                              <p className="font-semibold">
                                {itineraire.codeit}
                              </p>

                              <p className="text-xs">
                                {itineraire.villedep}
                                {" → "}
                                {itineraire.villearr}
                              </p>
                            </div>
                          ) : (
                            <span className="text-base-content/50">-</span>
                          )}
                        </td>

                        {/* DATE */}

                        <td>
                          <span className="whitespace-nowrap">
                            {formatDate(reception.date_recept)}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-info"
                              onClick={() => setSelectedReception(reception)}
                            >
                              Voir
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-error"
                              onClick={() => handleDelete(reception.idrecept)}
                            >
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ======================================
          MODAL AJOUT
      ====================================== */}

      <dialog id="modal-ajout-reception" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-2xl mb-2">Nouvelle réception</h3>

          <p className="text-base-content/60 mb-6">
            Enregistrer la réception d'un colis.
          </p>

          <ReceptionForm
            onSuccess={() => {
              document.getElementById("modal-ajout-reception")?.close();

              loadReceptions();
            }}
            onCancel={() => {
              document.getElementById("modal-ajout-reception")?.close();
            }}
          />
        </div>

        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* ======================================
          DETAILS
      ====================================== */}

      <ReceptionDetails
        reception={selectedReception}
        onClose={() => setSelectedReception(null)}
      />
    </div>
  );
};

export default Receptions;