// App.js
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import BienPage from "./Pages/BienPage/BienPage";
import DetailBien from "./components/DetailBien";
import AuthRoute from "./Authentification/AuthRoutes";

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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
