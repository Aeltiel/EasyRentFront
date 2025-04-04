import React, { useState, useEffect } from "react";
import { useAuth } from "../Authentification/AuthContext";

function LocataireList() {
  const [locataires, setLocataires] = useState([]);
  const [biensMap, setBiensMap] = useState({}); // Pour stocker les biens récupérés
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchLocataires = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8080/api/locataires", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des locataires: ${response.status}`);
        }

        const data = await response.json();
        setLocataires(data);

        // Récupérer les biens associés à chaque locataire
        const bienPromises = data.map(async (locataire) => {
          if (locataire.biens) {
            const bienId = locataire.biens.split('/').pop();
            const bienResponse = await fetch(`http://localhost:8080/api/biens/${bienId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            if (bienResponse.ok) {
              const bienData = await bienResponse.json();
              setBiensMap((prevBiens) => ({ ...prevBiens, [bienId]: bienData }));
            }
          }
        });

        await Promise.all(bienPromises);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLocataires();
  }, [token]);

  if (loading) {
    return <div className="text-center py-4">Chargement des locataires...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Liste des locataires</h2>
      {locataires.length === 0 ? (
        <p className="text-gray-500">Aucun locataire trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Prénom</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Téléphone</th>
                <th className="py-3 px-4 text-left">Bien Associé</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {locataires.map((locataire) => {
                const bien = biensMap[locataire.biens?.split('/').pop()];
                return (
                  <tr key={locataire.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{locataire.nom}</td>
                    <td className="py-3 px-4">{locataire.prenom}</td>
                    <td className="py-3 px-4">{locataire.email}</td>
                    <td className="py-3 px-4">{locataire.telephone}</td>
                    <td className="py-3 px-4">{bien ? bien.titre : "Aucun"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LocataireList;