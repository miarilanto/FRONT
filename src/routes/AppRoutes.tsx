// src/routes/AppRoutes.tsx

import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout/Layout";

// ==========================================
// DASHBOARD
// ==========================================

import Dashboard from "../pages/Dashboard/Dashboard";

// ==========================================
// ITINERAIRES
// ==========================================

import Itineraires from "../pages/Itineraires/Itineraires";

// ==========================================
// VOITURES
// ==========================================

import Voitures from "../pages/Voitures/Voitures";

// ==========================================
// ENVOIS
// ==========================================

import Envois from "../pages/Envois/Envois";

// ==========================================
// RECEPTIONS
// ==========================================

import Receptions from "../pages/Receptions/Receptions";
import ReceptionForm from "../pages/Receptions/ReceptionForm";
import ReceptionDetails from "../pages/Receptions/ReceptionDetails";

// ==========================================
// RAPPORTS
// ==========================================

import Rapports from "../pages/Rapports/Rapports";
import RecetteTotale from "../pages/Rapports/RecetteTotale";
import Statistiques from "../pages/Rapports/Statistiques";
import RecetteParVoiture from "../pages/Rapports/RecetteParVoiture";
import RecetteParItineraire from "../pages/Rapports/RecetteParItineraire";

// ==========================================
// ROUTES
// ==========================================

function AppRoutes() {
  return (
    <Routes>
      {/* =========================================
          LAYOUT PRINCIPAL
      ========================================= */}

      <Route path="/" element={<Layout />}>
        {/* =========================================
            DASHBOARD
            /
        ========================================= */}

        <Route index element={<Dashboard />} />

        {/* =========================================
            ITINERAIRES
            /itineraires
        ========================================= */}

        <Route path="itineraires" element={<Itineraires />} />

        {/* =========================================
            VOITURES
            /voitures
        ========================================= */}

        <Route path="voitures" element={<Voitures />} />

        {/* =========================================
            ENVOIS
            /envois
        ========================================= */}

        <Route path="envois" element={<Envois />} />

        {/* =========================================
            RECEPTIONS
        ========================================= */}

        <Route path="receptions">
          {/* /receptions */}
          <Route index element={<Receptions />} />

          {/* /receptions/nouveau */}
          <Route path="nouveau" element={<ReceptionForm />} />

          {/* /receptions/:id */}
          <Route path=":id" element={<ReceptionDetails />} />

          {/* /receptions/:id/modifier */}
          <Route path=":id/modifier" element={<ReceptionForm />} />
        </Route>

        {/* =========================================
            RAPPORTS
            /rapports
        ========================================= */}

        <Route path="rapports" element={<Rapports />}>
          {/* /rapports */}
          <Route index element={<RecetteTotale />} />

          {/* /rapports/recette */}
          <Route path="recette" element={<RecetteTotale />} />

          {/* /rapports/statistiques */}
          <Route path="statistiques" element={<Statistiques />} />

          {/* /rapports/voitures/:idvoit */}
          <Route path="voitures/:idvoit" element={<RecetteParVoiture />} />

          {/* /rapports/itineraires/:codeit */}
          <Route
            path="itineraires/:codeit"
            element={<RecetteParItineraire />}
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
