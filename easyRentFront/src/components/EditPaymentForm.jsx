import { useState, useEffect } from "react";
import { useAuth } from "../Authentification/AuthContext";

function EditPaymentForm({ payment, onClose, onPaymentUpdated }) {
  const [montant, setMontant] = useState(0);
  const [datePaiement, setDatePaiement] = useState("");
  const [moisConcerne, setMoisConcerne] = useState("");
  const [status, setStatus] = useState("En attente");
  const [locataireInfo, setLocataireInfo] = useState(null);
  const [bienInfo, setBienInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (payment) {
      setMontant(payment.montant);
      
      // Format date for datetime-local input
      const date = new Date(payment.datePaiement);
      const formattedDate = date.toISOString().slice(0, 16);
      setDatePaiement(formattedDate);
      
      setMoisConcerne(payment.moisConcerne);
      setStatus(payment.status);
      
      // Fetch locataire info
      fetchLocataireInfo(payment.locataire);
    }
  }, [payment]);

  const fetchLocataireInfo = async (locataireUrl) => {
    try {
      const locataireId = locataireUrl.split('/').pop();
      const response = await fetch(`http://localhost:8080/api/locataires/${locataireId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setLocataireInfo(data);
        
        // If locataire has bien information, fetch it
        if (data.biens && data.biens.length > 0) {
          fetchBienInfo(data.biens[0]);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du locataire:", error);
    }
  };
  
  const fetchBienInfo = async (bienUrl) => {
    try {
      const bienId = bienUrl.split('/').pop();
      const response = await fetch(`http://localhost:8080/api/biens/${bienId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBienInfo(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du bien:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!montant || !datePaiement || !moisConcerne) {
      setMessage("Tous les champs doivent être remplis");
      setLoading(false);
      return;
    }

    const paymentData = {
      montant: Number(montant),
      datePaiement,
      moisConcerne,
      status,
      locataire: payment.locataire
    };

    try {
      const response = await fetch(`http://localhost:8080/api/paiements/${payment.id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const updatedPayment = await response.json();
        setMessage("Règlement modifié avec succès!");
        
        // Notify parent component
        if (onPaymentUpdated) {
          onPaymentUpdated(updatedPayment);
        }
        
        // Close the form after a short delay
        setTimeout(() => onClose(), 1500);
      } else {
        const errorData = await response.json();
        setMessage(`Erreur: ${errorData.detail || "Échec de la modification du règlement"}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      setMessage("Erreur réseau lors de la modification du règlement");
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

  if (!payment) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Modifier le règlement</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        {bienInfo && (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <h3 className="font-semibold">Bien: {bienInfo.titre}</h3>
            <p className="text-sm text-gray-600">{bienInfo.adresse}</p>
          </div>
        )}
        
        {locataireInfo && (
          <div className="mb-4 p-3 bg-green-50 rounded-md">
            <h3 className="font-semibold">Locataire: {locataireInfo.nom} {locataireInfo.prenom}</h3>
            <p className="text-sm text-gray-600">{locataireInfo.email}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              step="0.01"
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
              <option value="">{moisConcerne || "Sélectionnez un mois"}</option>
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
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 !bg-blue-500 hover:!bg-blue-600 text-white rounded-md"
            >
              {loading ? "Enregistrement..." : "Confirmer"}
            </button>
          </div>
        </form>
        
        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes("Erreur") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default EditPaymentForm;
