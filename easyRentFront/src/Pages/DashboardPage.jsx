import { useAuth } from "../Authentification/AuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "../components/Nav";

function DashboardPage() {
  const location = useLocation();
  const { token } = useAuth(); // Récupérer le token via le contexte d'authentification
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement asynchrone (ex: vérification du token)
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="w-full">
        <div className="bg-white mb-2 shadow-lg rounded-lg">
            <Nav />
        </div>
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to the Dashboard!</p>
      </div>
    </div>
  );
}

export default DashboardPage;
