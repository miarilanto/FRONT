// src/routes/AppRoutes.tsx

import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout/Layout";
import Itineraires from "../pages/Itineraires/Itineraires";
import Voitures from "../pages/Voitures/Voitures";

// ==========================================
// RAPPORTS
// ==========================================

import Rapports from "../pages/Rapports/Rapports";
import RecetteTotale from "../pages/Rapports/RecetteTotale";
import Statistiques from "../pages/Rapports/Statistiques";
import RecetteParVoiture from "../pages/Rapports/RecetteParVoiture";
import RecetteParItineraire from "../pages/Rapports/RecetteParItineraire";

// ==========================================
// ENVOIS
// ==========================================

import Envois from "../pages/Envois/Envois";

function AppRoutes() {
  return (
    <Routes>

      {/* =========================================
          LAYOUT PRINCIPAL
      ========================================= */}

      <Route path="/" element={<Layout />}>

        {/* =========================================
            ITINÉRAIRES
        ========================================= */}

        <Route
          path="itineraires"
          element={<Itineraires />}
        />

        {/* =========================================
            VOITURES
        ========================================= */}

        <Route
          path="voitures"
          element={<Voitures />}
        />

        {/* =========================================
            ENVOIS
        ========================================= */}

        <Route
          path="envois"
          element={<Envois />}
        />

        {/* =========================================
            RAPPORTS
        ========================================= */}

        <Route path="rapports" element={<Rapports />}>

          <Route
            index
            element={<RecetteTotale />}
          />

          <Route
            path="recette"
            element={<RecetteTotale />}
          />

          <Route
            path="statistiques"
            element={<Statistiques />}
          />

          <Route
            path="voitures/:idvoit"
            element={<RecetteParVoiture />}
          />

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