// import { NavLink } from "react-router-dom";

// function Sidebar() {
//   const menuItems = [
//     {
//       label: "Dashboard",
//       path: "/",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1V10"
//           />
//         </svg>
//       ),
//     },

//     {
//       label: "Itinéraires",
//       path: "/itineraires",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M9 20l-5-2V6l5 2m0 12l6-2m-6 2V8m6 10l6 2V6l-6-2m0 14V4"
//           />
//         </svg>
//       ),
//     },

//     {
//       label: "Voitures",
//       path: "/voitures",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M5 17h14l1-5H4l1 5zm2 0v2m10-2v2M4 12l2-5h12l2 5M7 9h10"
//           />
//         </svg>
//       ),
//     },

//     {
//       label: "Envois",
//       path: "/envois",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M20 13V7a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 7v6a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0020 13z"
//           />
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M3.27 6.96L12 12l8.73-5.04M12 22V12"
//           />
//         </svg>
//       ),
//     },

//     {
//       label: "Réceptions",
//       path: "/receptions",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M12 3v12m0 0l4-4m-4 4l-4-4M5 21h14"
//           />
//         </svg>
//       ),
//     },

//     {
//       label: "Rapports",
//       path: "/rapports",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-5 w-5"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//           strokeWidth={2}
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             d="M4 19V5m0 14h16M8 16v-5m4 5V7m4 9v-8"
//           />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <aside className="flex gap-80 min-h-screen w-64 flex-col bg-slate-900 text-white">
//       {/* Logo */}
//       <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
//         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M20 13V7a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 7v6a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0020 13z"
//             />
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M3.27 6.96L12 12l8.73-5.04M12 22V12"
//             />
//           </svg>
//         </div>

//         <div>
//           <h1 className="text-lg font-bold tracking-tight">
//             GestiColis
//           </h1>

//           <p className="text-xs text-slate-400">
//             Gestion des colis
//           </p>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-3 py-6">
//         <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
//           Menu principal
//         </p>

//         <div className="space-y-1">
//           {menuItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               className={({ isActive }) =>
//                 `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
//                   isActive
//                     ? "bg-blue-600 text-white shadow-sm"
//                     : "text-slate-300 hover:bg-slate-800 hover:text-white"
//                 }`
//               }
//             >
//               <span className="shrink-0">
//                 {item.icon}
//               </span>

//               <span>{item.label}</span>
//             </NavLink>
//           ))}
//         </div>
//       </nav>

//       {/* Informations système */}
//       <div className="border-t border-slate-800 p-4">
//         <div className="flex items-center gap-3 rounded-lg bg-slate-800/60 px-3 py-3">
//           <span className="relative flex h-3 w-3">
//             <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>

//             <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
//           </span>

//           <div>
//             <p className="text-xs font-medium text-slate-200">
//               Système opérationnel
//             </p>

//             <p className="text-[11px] text-slate-500">
//               Service disponible
//             </p>
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }

// export default Sidebar;




import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Route,
  Car,
  PackageCheck,
  PackageOpen,
  BarChart3,
} from "lucide-react";

const MENU_ITEMS = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Itinéraires", path: "/itineraires", icon: Route },
  { label: "Voitures", path: "/voitures", icon: Car },
  { label: "Envois", path: "/envois", icon: PackageOpen },
  { label: "Réceptions", path: "/receptions", icon: PackageCheck },
  { label: "Rapports", path: "/rapports", icon: BarChart3 },
];

function Logo() {
  return (
    <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
        <PackageOpen className="h-6 w-6 text-white" strokeWidth={2} />
      </div>
      <div>
        <h1 className="text-lg font-bold tracking-tight text-white">
          GestiColis
        </h1>
        <p className="text-xs text-slate-400">Gestion des colis</p>
      </div>
    </div>
  );
}

function NavItem({ label, path, icon: Icon }) {
  return (
    <NavLink
      to={path}
      end={path === "/"}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
          isActive
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`
      }
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={2} />
      <span>{label}</span>
    </NavLink>
  );
}

function SystemStatus() {
  return (
    <div className="border-t border-slate-800 p-4">
      <div className="flex items-center gap-3 rounded-lg bg-slate-800/60 px-3 py-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
        </span>
        <div>
          <p className="text-xs font-medium text-slate-200">
            Système opérationnel
          </p>
          <p className="text-[11px] text-slate-500">Service disponible</p>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-900">
      <Logo />

      <nav className="flex-1 px-3 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Menu principal
        </p>
        <div className="space-y-1">
          {MENU_ITEMS.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
      </nav>

      <SystemStatus />
    </aside>
  );
}

export default Sidebar;
