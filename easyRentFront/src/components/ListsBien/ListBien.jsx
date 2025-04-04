// components/BienList.js
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import './ListBien.css'
import { useAuth } from "../../Authentification/AuthContext";

function BienList() {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [villeRecherche, setVilleRecherche] = useState(""); // État pour la ville saisie
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bienToUpdate, setBienToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState(false);
  const { token } = useAuth();
  const [showLocataireWarningModal, setShowLocataireWarningModal] = useState(false);
  const [bienWithLocataires, setBienWithLocataires] = useState(null);

  useEffect(() => {
    fetchBiens();
  }, [token]);

  const fetchBiens = async () => {
    try {
      setLoading(true);
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

  const biensFiltres = useMemo(() => {
    return biens.filter(bien =>
      bien.adresse.toLowerCase().includes(villeRecherche.toLowerCase())
    );
  }, [biens, villeRecherche]);

  const handleStatusChange = (bien, newActifStatus) => {
    // Si le bien a des locataires et on tente de le désactiver
    if (bien.locataires && bien.locataires.length > 0 && !newActifStatus) {
      // Au lieu d'afficher un simple message d'erreur, on ouvre une modale d'information
      setBienWithLocataires(bien);
      setShowLocataireWarningModal(true);
      return;
    }
    
    setBienToUpdate(bien);
    setNewStatus(newActifStatus);
    setShowConfirmModal(true);
  };

  const confirmStatusChange = async () => {
    if (!bienToUpdate) return;
    
    try {
      // Créer une copie du bien avec le nouveau statut actif
      const updatedBien = {
        ...bienToUpdate,
        actif: newStatus
      };
      
      // Supprimer l'id avant l'envoi (car il est dans l'URL)
      const { id, ...bienToSend } = updatedBien;
      
      const response = await fetch(`http://localhost:8080/api/biens/${bienToUpdate.id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bienToSend)
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la mise à jour du statut: ${response.status}`);
      }
      
      // Mettre à jour la liste locale des biens
      setBiens(prevBiens => 
        prevBiens.map(bien => 
          bien.id === bienToUpdate.id ? { ...bien, actif: newStatus } : bien
        )
      );
      
      // Afficher le message de succès
      setSuccessMessage(`Le bien a été ${newStatus ? 'activé' : 'désactivé'} avec succès!`);
      setTimeout(() => setSuccessMessage(""), 5000);
      
      // Fermer la modale
      setShowConfirmModal(false);
      setBienToUpdate(null);
      
    } catch (err) {
      setError(err.message);
      setShowConfirmModal(false);
    }
  };

  const cancelStatusChange = () => {
    setShowConfirmModal(false);
    setBienToUpdate(null);
  };

  const closeLocataireWarningModal = () => {
    setShowLocataireWarningModal(false);
    setBienWithLocataires(null);
  };

  if (loading) return <p className="text-center">Chargement des biens...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Liste des Biens</h2>

      {/* Messages de succès ou d'erreur */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

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
        <div className="grid grid-cols-5 gap-4 p-6 mb-6">
          <h3 className="font-semibold text-white">Titre</h3>
          <p className="text-white text-sm">Adresse</p>
          <p className="text-white">Surface</p>
          <p className="text-white">Loyer</p>
          <p className="text-white">Statut</p>
        </div>

        {/* Liste des biens filtrés */}
        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
          {biensFiltres.map((bien) => (
            <div
              key={bien.id}
              className="grid grid-cols-5 gap-4 bg-white shadow-sm rounded-lg p-4 border border-gray-200 mb-4"
            >
              <Link 
                to={`/bien/${bien.id}`}
                className="col-span-4 grid grid-cols-4 gap-4"
              >
                <span className="font-semibold text-gray-800">{bien.titre}</span>
                <span className="text-gray-600 text-sm">{bien.adresse}</span>
                <span className="text-gray-700">{bien.surface} m²</span>
                <span className="text-gray-700">{bien.loyer} €</span>
              </Link>
              <div>
                <select 
                  value={bien.actif ? "true" : "false"}
                  onChange={(e) => handleStatusChange(bien, e.target.value === "true")}
                  className={`px-2 py-1 rounded ${
                    bien.actif 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <option value="true">Actif</option>
                  <option value="false">Inactif</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de confirmation */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirmation</h3>
            <p className="mb-6">
              Êtes-vous sûr de vouloir {newStatus ? 'activer' : 'désactiver'} ce bien ? 
              <span className="block font-semibold mt-2">{bienToUpdate?.titre}</span>
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={cancelStatusChange}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Annuler
              </button>
              <button
                onClick={confirmStatusChange}
                className={`px-4 py-2 ${
                  newStatus 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "bg-red-500 hover:bg-red-600"
                } text-white rounded`}
              >
                {newStatus ? 'Activer' : 'Désactiver'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nouvelle modale d'avertissement pour les biens avec locataires */}
      {showLocataireWarningModal && bienWithLocataires && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center mb-4 text-orange-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-bold">Impossible de désactiver</h3>
            </div>
            
            <p className="mb-4">
              Le bien <span className="font-semibold">{bienWithLocataires.titre}</span> ne peut pas être désactivé car il a encore 
              <span className="font-semibold text-orange-600"> {bienWithLocataires.locataires.length} locataire(s)</span> associé(s).
            </p>
            
            <p className="mb-6 text-gray-600 text-sm">
              Pour désactiver ce bien, vous devez d'abord supprimer tous les locataires qui lui sont associés.
            </p>
            
            <div className="flex justify-end">
              <button
                onClick={closeLocataireWarningModal}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BienList;