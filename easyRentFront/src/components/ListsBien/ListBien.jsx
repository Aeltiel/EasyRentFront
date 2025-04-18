// components/BienList.js
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import './ListBien.css'
import { useAuth } from "../../Authentification/AuthContext";

function BienList() {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [villeRecherche, setVilleRecherche] = useState(""); // État pour la ville saisie
  const { token } = useAuth();


  useEffect(() => {
    const fetchBiens = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/biens", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des biens");
        }
        const data = await response.json();
        setBiens(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBiens();
  }, [token]);

  const biensFiltres = useMemo(() => {
    return biens.filter(bien =>
      bien.adresse.toLowerCase().includes(villeRecherche.toLowerCase())
    );
  }, [biens, villeRecherche]);

  if (loading) return <p className="text-center">Chargement des biens...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Liste des Biens</h2>

      {/* Champ de saisie pour la ville */}
      <input
        type="text"
        placeholder="Rechercher par adresse"
        value={villeRecherche}
        onChange={(e) => setVilleRecherche(e.target.value)}
        className="border p-2 mb-4 w-full rounded-md"
      />

      <div className="space-y-4 bg-[#1387C4] px-6 pb-6 rounded-lg">
        {/* Titre de la section avec la grid */}
        <div className="grid grid-cols-4 gap-4 p-6 mb-6">
          <h3 className="font-semibold text-white">Titre</h3>
          <p className="text-white text-sm">Adresse</p>
          <p className="text-white">Surface</p>
          <p className="text-white">Loyer</p>
        </div>

        {/* Liste des biens filtrés */}
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          {biensFiltres.map((bien) => (
            <Link
              key={bien.id}
              className="grid grid-cols-4 gap-4 bg-white shadow-sm rounded-lg p-4 border border-gray-200 mb-4"
              to={`/bien/${bien.id}`}
            >
              <h3 className="font-semibold text-gray-800">{bien.titre}</h3>
              <p className="text-gray-600 text-sm">{bien.adresse}</p>
              <p className="text-gray-700">{bien.surface} m²</p>
              <p className="text-gray-700">{bien.loyer} €</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BienList;