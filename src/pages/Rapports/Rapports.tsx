import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Home, BarChart3, Car, Map, FileText, TrendingUp } from "lucide-react";

export const Rapports: React.FC = () => {
  const location = useLocation();

  const menus = [
    {
      to: "/rapports/recette",
      label: "Recette totale",
      icon: Home,
      description: "Voir la recette globale",
    },
    {
      to: "/rapports/statistiques",
      label: "Statistiques",
      icon: BarChart3,
      description: "Analyses & indicateurs clés",
    },
    {
      to: "/rapports/voitures/V001",
      label: "Recette par voiture",
      icon: Car,
      description: "Rentabilité par véhicule",
    },
    {
      to: "/rapports/itineraires/IT001",
      label: "Recette par itinéraire",
      icon: Map,
      description: "Bilan par trajet & ligne",
    },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-full space-y-6 p-4 md:p-6">
      {/* =====================================================
          1. EN-TÊTE DE LA PAGE (MÊME DESIGN QUE RÉCEPTIONS)
      ====================================================== */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <FileText className="h-6 w-6" strokeWidth={2} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Rapports & Statistiques
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Consultez les recettes financières, les bilans par véhicule et les
              analyses de trafic
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-600 sm:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
          <span>Données consolidées en temps réel</span>
        </div>
      </div>

      {/* =====================================================
          2. MENU DE NAVIGATION DES RAPPORTS
      ====================================================== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xs">
        <nav>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {menus.map((menu) => {
              const Icon = menu.icon;
              const active = isActive(menu.to);

              return (
                <li key={menu.to}>
                  <Link
                    to={menu.to}
                    className={`group flex items-center gap-3.5 rounded-xl p-3 transition-all duration-200 ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
                        : "border border-slate-200/70 bg-slate-50/70 text-slate-700 hover:border-blue-200 hover:bg-slate-100/80 hover:text-slate-900"
                    }`}
                  >
                    {/* Icône avec badge */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                        active
                          ? "bg-white/20 text-white shadow-inner"
                          : "border border-slate-200/80 bg-white text-blue-600 group-hover:border-blue-300 group-hover:bg-blue-50/50"
                      }`}
                    >
                      <Icon size={20} strokeWidth={2} />
                    </div>

                    {/* Textes de l'onglet */}
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold leading-tight">
                        {menu.label}
                      </span>
                      <span
                        className={`block truncate text-xs mt-0.5 ${
                          active
                            ? "text-blue-100"
                            : "text-slate-400 group-hover:text-slate-500"
                        }`}
                      >
                        {menu.description}
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* =====================================================
          3. CONTENU DU RAPPORT ACTIF (SOUS-ROUTES)
      ====================================================== */}
      <div className="min-h-[420px] rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Rapports;
