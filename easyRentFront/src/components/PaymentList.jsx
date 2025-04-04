import { useState, useEffect } from "react";
import { useAuth } from "../Authentification/AuthContext";

function PaymentList({ onRefresh, onEditPayment }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locatairesMap, setLocatairesMap] = useState({});
  const [biensMap, setBiensMap] = useState({});
  const [selectedBienId, setSelectedBienId] = useState("all");
  const [biens, setBiens] = useState([]);
  const { token } = useAuth();

  // Fetch all payments
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/api/paiements", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des paiements: ${response.status}`);
      }

      const data = await response.json();
      setPayments(data);
      
      // Extract unique locataire IDs to fetch
      const locataireIds = Array.from(new Set(
        data.map(payment => {
          const parts = payment.locataire.split('/');
          return parts[parts.length - 1];
        })
      ));
      
      // Fetch locataire details
      await fetchLocataireDetails(locataireIds);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch all biens
  const fetchBiens = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/biens", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des biens: ${response.status}`);
      }

      const data = await response.json();
      setBiens(data);

      // Create a map of bien IDs to bien objects
      const biensData = {};
      data.forEach(bien => {
        biensData[bien.id] = bien;
      });
      setBiensMap(biensData);
    } catch (err) {
      console.error("Erreur lors de la récupération des biens:", err);
    }
  };

  // Fetch locataires details
  const fetchLocataireDetails = async (locataireIds) => {
    try {
      const locatairesData = {};
      
      await Promise.all(locataireIds.map(async (id) => {
        const response = await fetch(`http://localhost:8080/api/locataires/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const locataireData = await response.json();
          locatairesData[id] = locataireData;

          // Fetch the bien associated with this locataire if it's not already in biensMap
          if (locataireData.biens && locataireData.biens.length > 0) {
            for (const bienUrl of locataireData.biens) {
              const bienId = bienUrl.split('/').pop();
              if (!biensMap[bienId]) {
                const bienResponse = await fetch(`http://localhost:8080/api/biens/${bienId}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                });
                
                if (bienResponse.ok) {
                  const bienData = await bienResponse.json();
                  setBiensMap(prev => ({ ...prev, [bienId]: bienData }));
                }
              }
            }
          }
        }
      }));
      
      setLocatairesMap(locatairesData);
    } catch (err) {
      console.error("Erreur lors de la récupération des détails des locataires:", err);
    }
  };

  useEffect(() => {
    fetchBiens();
    fetchPayments();
  }, [token, onRefresh]);

  const getLocataireNameById = (locataireUrl) => {
    const parts = locataireUrl.split('/');
    const id = parts[parts.length - 1];
    const locataire = locatairesMap[id];
    
    if (locataire) {
      return `${locataire.nom} ${locataire.prenom}`;
    }
    return "Locataire inconnu";
  };

  const getBienForLocataire = (locataireUrl) => {
    const locataireId = locataireUrl.split('/').pop();
    const locataire = locatairesMap[locataireId];

    if (locataire && locataire.biens && locataire.biens.length > 0) {
      const bienId = locataire.biens[0].split('/').pop();
      return biensMap[bienId];
    }
    return null;
  };

  const getBienForPayment = (payment) => {
    const bien = getBienForLocataire(payment.locataire);
    return bien ? bien : { id: "unknown", titre: "Bien inconnu" };
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'paye':
        return 'bg-green-100 text-green-800';
      case 'attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'paye':
        return 'Payé';
      case 'attente':
        return 'En attente';
      case 'retard':
        return 'Retard';
      default:
        return status;
    }
  };

  const filteredPayments = selectedBienId === "all" 
    ? payments 
    : payments.filter(payment => {
        const bien = getBienForPayment(payment);
        return bien.id.toString() === selectedBienId;
      });

  if (loading) {
    return <div className="text-center py-4">Chargement des paiements...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Liste des règlements</h2>
      </div>
      
      {filteredPayments.length === 0 ? (
        <p className="text-gray-500">Aucun règlement ne correspond à votre sélection.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-4 text-left">Locataire</th>
                <th className="py-3 px-4 text-left">Montant</th>
                <th className="py-3 px-4 text-left">Date de paiement</th>
                <th className="py-3 px-4 text-left">Statut</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredPayments.map((payment) => {
                return (
                  <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">{getLocataireNameById(payment.locataire)}</td>
                    <td className="py-3 px-4">{payment.montant} €</td>
                    <td className="py-3 px-4">
                      {new Date(payment.datePaiement).toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(payment.status)}`}>
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button 
                        onClick={() => onEditPayment(payment)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Modifier
                      </button>
                    </td>
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

export default PaymentList;
