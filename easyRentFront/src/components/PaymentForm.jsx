import { useState, useEffect } from "react";
import { useAuth } from "../Authentification/AuthContext";

function PaymentForm({ onPaymentAdded }) {
  const [montant, setMontant] = useState(0);
  const [datePaiement, setDatePaiement] = useState("");
  const [moisConcerne, setMoisConcerne] = useState("");
  const [status, setStatus] = useState("En attente");
  const [locataireId, setLocataireId] = useState("");
  const [locataires, setLocataires] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  // Fetch all locataires for the dropdown
  useEffect(() => {
    const fetchLocataires = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/locataires", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setLocataires(data);
        } else {
          setMessage("Erreur lors du chargement des locataires");
        }
      } catch (error) {
        console.error("Erreur réseau:", error);
        setMessage("Erreur réseau lors du chargement des locataires");
      }
    };

    fetchLocataires();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!montant || !datePaiement || !moisConcerne || !locataireId) {
      setMessage("Tous les champs doivent être remplis");
      setLoading(false);
      return;
    }

    const paymentData = {
      montant: Number(montant),
      datePaiement,
      moisConcerne,
      status,
      locataire: `/api/locataires/${locataireId}`
    };

    try {
      const response = await fetch("http://localhost:8080/api/paiements", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Paiement enregistré avec succès!");
        // Reset form
        setMontant(0);
        setDatePaiement("");
        setMoisConcerne("");
        setStatus("En attente");
        setLocataireId("");
        
        // Notify parent component
        if (onPaymentAdded) {
          onPaymentAdded(data);
        }
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.detail || "Échec de l'enregistrement du paiement"}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Erreur réseau lors de l'enregistrement du paiement");
    } finally {
      setLoading(false);
    }
  };

  // Generate months options (current month + 11 previous months)
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    for (let i = 0; i < 12; i++) {
      const monthIndex = (currentMonth - i) < 0 ? (12 + (currentMonth - i)) : (currentMonth - i);
      const year = (currentMonth - i) < 0 ? currentYear - 1 : currentYear;
      const monthName = new Date(year, monthIndex).toLocaleString('fr-FR', { month: 'long' });
      const value = `${monthName} ${year}`;
      options.push(<option key={value} value={value}>{value}</option>);
    }
    
    return options;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Enregistrer un paiement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Locataire
          </label>
          <select
            value={locataireId}
            onChange={(e) => setLocataireId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Sélectionnez un locataire</option>
            {locataires.map((locataire) => (
              <option key={locataire.id} value={locataire.id}>
                {locataire.nom} {locataire.prenom}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant (€)
          </label>
          <input
            type="number"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
            min="0"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de paiement
          </label>
          <input
            type="datetime-local"
            value={datePaiement}
            onChange={(e) => setDatePaiement(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mois concerné
          </label>
          <select
            value={moisConcerne}
            onChange={(e) => setMoisConcerne(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Sélectionnez un mois</option>
            {generateMonthOptions()}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="Payé">Payé</option>
            <option value="En attente">En attente</option>
            <option value="Retard">Retard</option>
          </select>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full !bg-green-500 hover:!bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? "Enregistrement..." : "Enregistrer le paiement"}
          </button>
        </div>
      </form>
      
      {message && (
        <div className={`mt-4 p-3 rounded ${message.includes("Erreur") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default PaymentForm;
