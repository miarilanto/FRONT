import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout/Layout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Itineraires from "../pages/Itineraires/Itineraires";
import Voitures from "../pages/Voitures/Voitures";
import Envois from "../pages/Envois/Envois";
import Receptions from "../pages/Receptions/Receptions";
import Rapports from "../pages/Rapports/Rapports";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        <Route index element={<Dashboard />} />

        <Route path="itineraires" element={<Itineraires />} />

        <Route path="voitures" element={<Voitures />} />

        <Route path="envois" element={<Envois />} />

        <Route path="receptions" element={<Receptions />} />

        <Route path="rapports" element={<Rapports />} />

      </Route>
    </Routes>
  );
}

export default AppRoutes;