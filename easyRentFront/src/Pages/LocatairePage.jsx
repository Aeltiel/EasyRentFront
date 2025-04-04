import Nav from "../components/Nav";
import FormulaireLoc from "../components/FormulaireLoc";
import { useAuth } from "../Authentification/AuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

function LocatairePage() {
  const { token } = useAuth();
  const location = useLocation();
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
    <main className="w-full">
      <div className="bg-white mb-2 shadow-lg rounded-lg">
        <Nav />
      </div>
      <div>
        <FormulaireLoc />
      </div>
    </main>
  );
}
export default LocatairePage;
