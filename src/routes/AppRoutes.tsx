// src/AppRoutes.tsx

import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout/Layout";

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
import EnvoiForm from "../pages/Envois/EnvoiForm";
import EnvoiDetails from "../pages/Envois/EnvoiDetails";

// ==========================================
// RECEPTIONS
// ==========================================

import Receptions from "../pages/Receptions/Receptions";
import ReceptionForm from "../pages/Receptions/ReceptionForm";
import ReceptionDetails from "../pages/Receptions/ReceptionDetails";

function AppRoutes() {
  return (
    <Routes>
      {/* =========================================
          LAYOUT PRINCIPAL
      ========================================= */}

      <Route path="/" element={<Layout />}>
        {/* =========================================
            ENVOIS
        ========================================= */}

        <Route path="envois">
          {/* /envois */}
          <Route index element={<Envois />} />

          {/* /envois/nouveau */}
          <Route path="nouveau" element={<EnvoiForm />} />

          {/* /envois/:id */}
          <Route path=":id" element={<EnvoiDetails />} />

          {/* /envois/:id/modifier */}
          <Route path=":id/modifier" element={<EnvoiForm />} />
        </Route>

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
