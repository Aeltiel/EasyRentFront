import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { useAuth } from '../Authentification/AuthContext';
import FormulaireLoc from './FormulaireLoc';

function DetailBien() {
  const { id } = useParams();
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);
  const [suppressionReussie, setSuppressionReussie] = useState(false);
  const [modificationEnCours, setModificationEnCours] = useState(false);
  const [bienAModifier, setBienAModifier] = useState(null);
  const [afficherFormulaireLocataire, setAfficherFormulaireLocataire] = useState(false);
  const [ajoutLocataireReussi, setAjoutLocataireReussi] = useState(false);
  const [locataireAjoute, setLocataireAjoute] = useState(null);
  const [locataires, setLocataires] = useState([]);
  const [locatairesLoading, setLocatairesLoading] = useState(true);
  const [locataireAModifier, setLocataireAModifier] = useState(null); // Ajout de l'état pour le locataire à modifier

  const { token } = useAuth();
  const navigate = useNavigate();

    const fetchBien = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/biens/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération du bien: ${response.status}`);
        }
        const data = await response.json();
        setBien(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
  
    const fetchLocataires = async (locataireLinks) => {
      if (!locataireLinks || locataireLinks.length === 0) {
        setLocataires([]);
        setLocatairesLoading(false);
        return;
      }
  
      try {
        const locataireIds = locataireLinks.map((link) => link.split('/').pop());
        const locatairesData = await Promise.all(
          locataireIds.map(async (locataireId) => {
            const response = await fetch(`http://localhost:8080/api/locataires/${locataireId}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            if (!response.ok) {
              throw new Error(`Erreur lors de la récupération du locataire ${locataireId}: ${response.status}`);
            }
            return await response.json();
          })
        );
        setLocataires(locatairesData);
        setLocatairesLoading(false);
      } catch (err) {
        setError(err.message);
        setLocatairesLoading(false);
      }
    };
  
    useEffect(() => {
      fetchBien();
    }, [id, token]);
  
    useEffect(() => {
      if (bien && bien.locataires) {
        fetchLocataires(bien.locataires);
      }
    }, [bien]);
  
    const supprimerBien = async () => {
      if (window.confirm('Êtes-vous sûr de vouloir supprimer ce bien ?')) {
        setSuppressionEnCours(true);
        try {
          const response = await fetch(`http://localhost:8080/api/biens/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error(`Erreur lors de la suppression du bien: ${response.status}`);
          } else {
            setSuppressionReussie(true);
            setSuppressionEnCours(false);
            navigate('/bien');
          }
        } catch (err) {
          setError(err.message);
          setSuppressionEnCours(false);
        }
      }
    };
  
    const modifierBien = () => {
      navigate(`/modification/bien/${id}`, { state: { bienData: bien } });
    };


  const handleAjouterLocataireClick = (locataire = null) => {
    setLocataireAModifier(locataire); // Si locataire est fourni, c'est une modification
    setAfficherFormulaireLocataire(true);
    setAjoutLocataireReussi(false);
    setLocataireAjoute(null);
  };

  const handleLocataireAjoute = (newLocataire) => {
    setAfficherFormulaireLocataire(false);
    setAjoutLocataireReussi(true);
    setLocataireAjoute(newLocataire);
    setLocataireAModifier(null); // Réinitialiser le locataire à modifier
    if (bien && bien.locataires) {
      fetchLocataires(bien.locataires);
    }
    console.log('Locataire ajouté/modifié avec succès:', newLocataire);
  };

  if (loading || locatairesLoading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  if (!bien) {
    return <p>Bien non trouvé.</p>;
  }

  return (
    <div className="w-full">
      <div className="bg-white mb-2 shadow-lg rounded-lg">
        <Nav />
      </div>
      <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{bien.titre}</h1>
        <div className="mb-4">
          <strong>Adresse</strong>
          <div>{bien.adresse}</div>
        </div>
        <div className="mb-4">
          <strong>Type</strong>
          <div>{bien.type}</div>
          <div className="mb-4">
            <strong>Surface</strong> {bien.surface} m²
          </div>
        </div>
        <div className="mb-4">
          <strong>Loyer mensuel</strong>
          <div className="text-xl">
            <span className="text-green-600">{bien.loyer}</span> €
          </div>
        </div>
        {locataireAjoute && (
          <div className="mt-4 border p-4 rounded-md bg-gray-100">
            <h3 className="text-lg font-semibold mb-2">Locataire ajouté :</h3>
            <p>
              <strong>Nom Prénom:</strong> {locataireAjoute.nom} {locataireAjoute.prenom}
            </p>
            <p>
              <strong>Email :</strong> {locataireAjoute.email}
            </p>
            <p>
              <strong>Téléphone :</strong> {locataireAjoute.telephone}
            </p>
            <p>
              <strong>Date d'entrée :</strong> {new Date(locataireAjoute.dateEntree).toLocaleDateString()}
            </p>
          </div>
        )}


        <h2 className="font-bold mt-8">Locataires</h2>
        {locataires.length > 0 ? (
          <ul className="list-disc list-inside">
            {locataires.map((locataire) => (
              <li key={locataire.id} className="flex items-center justify-between mb-2">
                <span>{locataire.nom} {locataire.prenom}</span>
                <button
                  onClick={() => handleAjouterLocataireClick(locataire)} // Utiliser handleAjouterLocataireClick pour la modification
                  className="!bg-blue-500 !hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Modifier
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun locataire associé à ce bien pour le moment.</p>
        )}

        <button
          onClick={supprimerBien}
          disabled={suppressionEnCours}
          className="!bg-red-500 !hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2 mt-4"
        >
          {suppressionEnCours ? 'Suppression...' : 'Supprimer'}
        </button>
        <button
          onClick={modifierBien}
          disabled={modificationEnCours}
          className="!bg-yellow-500 !hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mr-2 mt-4"
        >
          {modificationEnCours ? 'Modification...' : 'Modifier'}
        </button>


        <button
          onClick={() => handleAjouterLocataireClick()} // Utiliser handleAjouterLocataireClick pour l'ajout
          className="!bg-green-500 !hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Ajouter un locataire
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        {suppressionReussie && <p className="text-green-500 mt-2">Bien supprimé avec succès !</p>}
        {ajoutLocataireReussi && <p className="text-green-500 mt-2">Locataire ajouté/modifié avec succès !</p>}

        {afficherFormulaireLocataire && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">{locataireAModifier ? "Modifier le locataire" : "Ajouter un locataire"}</h2>
            <FormulaireLoc bienId={id} onLocataireAjoute={handleLocataireAjoute} locataire={locataireAModifier} />
          </div>
        )}
      </div>
    </div>
  );
}

export default DetailBien;