import { useAuth } from "../Authentification/AuthContext";
import { useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "../components/Nav";

function DashboardPage() {
  const location = useLocation();
  const { token } = useAuth(); // Récupérer le token via le contexte d'authentification
  const [loading, setLoading] = useState(true);
  const [paiements, setPayments] = useState([]);

  //appel à l'api pour récupérer les paiements
  const getPayments = async () => {
    const response = await fetch("http://localhost:8080/api/paiements", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response) {
      console.log("Requête échouée avec le status : " + response.status);
      return;
    }
    const dataPaiements = await response.json();
    setPayments(dataPaiements);
  }

  useEffect(() => {
    getPayments();
    // Simuler un chargement asynchrone (ex: vérification du token)
    setTimeout(() => setLoading(false), 1000);

  }, [paiements]);
  
  console.log(paiements);

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
      <div className="flex justify-between ml-20 mt-10 mr-20">
        <div>
          <h2 className="text-6xl mb-8">Total des revenus</h2>
          <div className="flex justify-between">
            <div className="bg-[#19B953] rounded-lg w-48 p-4 text-center text-white text-4xl font-semibold">
              <p>Année</p>
              <p>4800 €</p>
            </div>
            <div className="bg-[#19B953] rounded-lg w-48 p-4 text-center text-white text-4xl font-semibold">
              <p>Mois</p>
              <p>400 €</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-6xl mb-8">Loyers</h2>
          <div>
            <div className="flex items-center mb-3 text-4xl">
              <p className="font-bold">1</p>
              <div className="bg-[#19B953] rounded-lg w-full p-2 ml-2 text-white">
                Payé
              </div>
            </div>
            <div className="flex items-center mb-3 text-4xl">
              <p className="font-bold">1</p>
              <div className="bg-[#FF9A01] rounded-lg w-full p-2 ml-2 text-white">
                Attente
              </div>
            </div>
            <div className="flex items-center text-4xl">
              <p className="font-bold">1</p>
              <div className="bg-[#DA3E44] rounded-lg w-full p-2 ml-2 text-white">
                Retard
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-6xl mb-8">Biens</h2>
          <div className="bg-[#1387C4] rounded-lg p-4 mb-3 text-white text-3xl"> <span className="font-bold">1</span> Loué(s)</div>
          <div className="bg-[#1387C4] rounded-lg p-4 mb-3 text-white text-3xl"><span className="font-bold">1</span> Actif(s)</div>
          <div className="bg-[#1387C4] rounded-lg p-4 text-white text-3xl"><span className="font-bold">1</span> Inactif(s)</div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;
