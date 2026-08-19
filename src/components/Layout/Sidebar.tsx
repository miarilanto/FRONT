import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Route,
  Car,
  PackageCheck,
  PackageOpen,
  BarChart3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

// =========================================================
// 1. CONFIGURATION DES MENUS
// =========================================================

interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string;
}

const MENU_PRINCIPAL: MenuItem[] = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Envois", path: "/envois", icon: PackageOpen },
  { label: "Réceptions", path: "/receptions", icon: PackageCheck },
];

const MENU_GESTION: MenuItem[] = [
  { label: "Itinéraires", path: "/itineraires", icon: Route },
  { label: "Voitures", path: "/voitures", icon: Car },
  { label: "Rapports & Stats", path: "/rapports", icon: BarChart3 },
];

// =========================================================
// 2. SOUS-COMPOSANT LOGO
// =========================================================

function Logo() {
  return (
    <div className="flex items-center gap-3.5 border-b border-slate-800/80 px-6 py-5 bg-slate-900/40">
      {/* Icône avec gradient moderne et ombre colorée */}
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 shadow-lg shadow-blue-500/25 text-white">
        <PackageOpen className="h-6 w-6" strokeWidth={2.2} />
      </div>

      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-base font-extrabold tracking-tight text-white">
            GestiColis
          </h1>
          <span className="inline-flex items-center gap-0.5 rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-bold text-blue-400 border border-blue-500/20">
            PRO
          </span>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Logistique & Transport
        </p>
      </div>
    </div>
  );
}

// =========================================================
// 3. SOUS-COMPOSANT ÉLÉMENT DE NAVIGATION
// =========================================================

type NavItemProps = MenuItem;

function NavItem({ label, path, icon: Icon, badge }: NavItemProps) {
  return (
    <NavLink
      to={path}
      end={path === "/"}
      className={({ isActive }) =>
        `group relative flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20"
            : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-100 hover:translate-x-1"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3">
            {/* Conteneur d'icône avec surbrillance dynamique */}
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-slate-800/70 text-slate-400 group-hover:bg-slate-800 group-hover:text-blue-400"
              }`}
            >
              <Icon
                className="h-4.5 w-4.5 shrink-0"
                strokeWidth={isActive ? 2.2 : 2}
              />
            </div>

            <span className="truncate">{label}</span>
          </div>

          {/* Badge ou puce active */}
          {isActive ? (
            <span className="h-1.5 w-1.5 rounded-full bg-white shadow-xs animate-pulse" />
          ) : badge ? (
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200">
              {badge}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}

// =========================================================
// 4. SOUS-COMPOSANT ÉTAT DU SYSTÈME (FOOTER)
// =========================================================

function SystemStatus() {
  return (
    <div className="border-t border-slate-800/80 p-4 bg-slate-950/40">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-800/40 p-3 shadow-xs">
        {/* Indicateur ping vert pulsé */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-200 truncate">
              Système opérationnel
            </p>
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              100%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">
            Serveur connecté • v2.4
          </p>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// 5. COMPOSANT PRINCIPAL SIDEBAR
// =========================================================

export function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-900 border-r border-slate-800/80 select-none">
      {/* 1. Header / Logo */}
      <Logo />

      {/* 2. Navigation découpée en sections claires */}
      <nav className="flex-1 px-3.5 py-6 space-y-6 overflow-y-auto">
        {/* SECTION 1 : OPÉRATIONS */}
        <div>
          <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Opérations Colis
          </p>
          <div className="space-y-1">
            {MENU_PRINCIPAL.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </div>
        </div>

        {/* SECTION 2 : GESTION & ANALYSE */}
        <div>
          <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Gestion & Rapports
          </p>
          <div className="space-y-1">
            {MENU_GESTION.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </div>
        </div>
      </nav>

      {/* 3. Footer / État opérationnel */}
      <SystemStatus />
    </aside>
  );
}

export default Sidebar;
