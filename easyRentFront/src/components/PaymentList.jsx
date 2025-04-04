import { useState, useEffect } from "react";
import { useAuth } from "../Authentification/AuthContext";

function PaymentList({ onRefresh }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locatairesMap, setLocatairesMap] = useState({});
  const { token } = useAuth();

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
        }
      }));
      
      setLocatairesMap(locatairesData);
    } catch (err) {
      console.error("Erreur lors de la récupération des détails des locataires:", err);
    }
  };

  useEffect(() => {
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

  const getStatusClass = (status) => {
    switch(status) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des paiements...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Erreur: {error}</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Liste des paiements</h2>
      
      {payments.length === 0 ? (
        <p className="text-gray-500">Aucun paiement enregistré.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Locataire</th>
                <th className="py-3 px-6 text-left">Montant</th>
                <th className="py-3 px-6 text-left">Date de paiement</th>
                <th className="py-3 px-6 text-left">Mois concerné</th>
                <th className="py-3 px-6 text-left">Statut</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6">{payment.id}</td>
                  <td className="py-3 px-6">{getLocataireNameById(payment.locataire)}</td>
                  <td className="py-3 px-6">{payment.montant} €</td>
                  <td className="py-3 px-6">
                    {new Date(payment.datePaiement).toLocaleString('fr-FR')}
                  </td>
                  <td className="py-3 px-6">{payment.moisConcerne}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PaymentList;
