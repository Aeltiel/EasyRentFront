// App.js
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import BienPage from "./Pages/BienPage/BienPage";
import DetailBien from "./components/DetailBien";
import AuthRoute from "./Authentification/AuthRoutes";
import ModificationPage from "./Pages/ModificationPage/ModificationPage";

function App() {
  return (
    <div className="flex min-h-screen min-w-screen">
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<DashboardPage />} />

        {/* Routes protégées */}
        <Route element={<AuthRoute />}>
          <Route path="/bien" element={<BienPage />} />
          <Route path="/bien/:id" element={<DetailBien />} />
          <Route path="/modification/bien/:id" element={<ModificationPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
