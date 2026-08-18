import { Link, Outlet } from "react-router-dom";

function Rapports() {
  return (
    <div className="w-full mt-0 pt-0 px-6">
      {/* Menu des rapports en haut */}
      <nav className="mb-8">
        <ul className="menu menu-horizontal flex flex-row gap-40 bg-base-200 rounded-box shadow-md p-2">
          {/* Recette totale */}
          <li className="flex-none">
            <Link
              to="/rapports/recette"
              className="tooltip tooltip-bottom"
              data-tip="Recette totale"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a2 2 0 002 2h2a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z"
                />
              </svg>

              <span>Recette totale</span>
            </Link>
          </li>

          {/* Statistiques */}
          <li className="flex-none">
            <Link
              to="/rapports/statistiques"
              className="tooltip tooltip-bottom"
              data-tip="Statistiques"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

              <span>Statistiques</span>
            </Link>
          </li>

          {/* Recette par voiture */}
          <li className="flex-none">
            <Link
              to="/rapports/voitures/V001"
              className="tooltip tooltip-bottom"
              data-tip="Recette par voiture"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>

              <span>Recette par voiture</span>
            </Link>
          </li>

          {/* Recette par itinéraire */}
          <li className="flex-none">
            <Link
              to="/rapports/itineraires/IT001"
              className="tooltip tooltip-bottom"
              data-tip="Recette par itinéraire"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 20l-5.447-2.724A2 2 0 013 15.488V5.512a2 2 0 012.553-1.936L12 6l6.447-2.424A2 2 0 0121 5.512v9.976a2 2 0 01-2.553 1.936L12 15l-6.447 2.424"
                />
              </svg>

              <span>Recette par itinéraire</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Titre */}
      <h1 className="text-3xl font-bold mb-6">Rapports</h1>

      {/* Contenu de la page */}
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Rapports;
