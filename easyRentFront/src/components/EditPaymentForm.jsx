import { useState, useEffect } from "react";
import { useAuth } from "../Authentification/AuthContext";

function EditPaymentForm({ payment, onClose, onPaymentUpdated }) {
  const [montant, setMontant] = useState(0);
  const [datePaiement, setDatePaiement] = useState("");
  const [status, setStatus] = useState("attente");
  const [locataireInfo, setLocataireInfo] = useState(null);
  const [bienInfo, setBienInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingBien, setIsLoadingBien] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (payment) {
      setMontant(payment.montant);
      
      // Format date for datetime-local input
      const date = new Date(payment.datePaiement);
      const formattedDate = date.toISOString().slice(0, 16);
      setDatePaiement(formattedDate);
      
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
        if (data.biens) {
          // Biens can be a string (URL) or an array of URLs
          if (typeof data.biens === 'string') {
            await fetchBienInfo(data.biens);
          } else if (Array.isArray(data.biens) && data.biens.length > 0) {
            await fetchBienInfo(data.biens[0]);
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du locataire:", error);
    }
  };
  
  const fetchBienInfo = async (bienUrl) => {
    try {
      setIsLoadingBien(true);
      const bienId = typeof bienUrl === 'string' ? bienUrl.split('/').pop() : bienUrl;
      
      const response = await fetch(`http://localhost:8080/api/biens/${bienId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBienInfo(data);
      } else {
        console.error(`Erreur: ${response.status} - Le bien n'a pas pu être récupéré`);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du bien:", error);
    } finally {
      setIsLoadingBien(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!montant || !datePaiement) {
      setMessage("Tous les champs doivent être remplis");
      setLoading(false);
      return;
    }

    const paymentData = {
      montant: Number(montant),
      datePaiement,
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
        
        {/* Affichage du bien avec un état de chargement */}
        {isLoadingBien ? (
          <div className="mb-4 p-3 bg-blue-50 rounded-md animate-pulse">
            <p className="h-4 bg-blue-200 rounded w-3/4 mb-2"></p>
            <p className="h-3 bg-blue-100 rounded w-1/2"></p>
          </div>
        ) : bienInfo ? (
          <div className="mb-4 p-3 bg-blue-50 rounded-md">
            <h3 className="font-semibold">Bien: {bienInfo.titre}</h3>
            <p className="text-sm text-gray-600">{bienInfo.adresse}</p>
            <p className="text-sm text-gray-600 mt-1">{bienInfo.type} - {bienInfo.surface} m² - {bienInfo.loyer} €</p>
          </div>
        ) : (
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Aucune information sur le bien disponible</p>
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
            <p className="text-xs text-gray-500 mt-1">
              Le mois concerné sera automatiquement déterminé à partir de cette date.
            </p>
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
              <option value="paye" className="text-green-600 font-semibold">Payé</option>
              <option value="attente" className="text-yellow-600 font-semibold">En attente</option>
              <option value="retard" className="text-red-600 font-semibold">Retard</option>
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
