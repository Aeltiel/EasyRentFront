import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from './Nav';
import { useAuth } from '../Authentification/AuthContext';
import Formulaire from './Formulaire'; // Importez le formulaire

function DetailBien() {
  const { id } = useParams();
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [suppressionEnCours, setSuppressionEnCours] = useState(false);
  const [suppressionReussie, setSuppressionReussie] = useState(false);
  const [modificationEnCours, setModificationEnCours] = useState(false);
  const [bienAModifier, setBienAModifier] = useState(null);

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBien = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/biens/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération du bien.');
        }
        const data = await response.json();
        setBien(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchBien();
  }, [id]);

  const supprimerBien = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bien ?")) {
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
          throw new Error("Erreur lors de la suppression du bien.");
        } else {
          setSuppressionReussie(true);
          setSuppressionEnCours(false);
          navigate("/bien");
        }
      } catch (err) {
        setError(err.message);
        setSuppressionEnCours(false);
      }
    }
  };

  const modifierBien = () => {
    setBienAModifier(bien);
    setModificationEnCours(true);
  };

  const handleModificationTerminee = (bienModifie) => {
    setBien(bienModifie);
    setModificationEnCours(false);
    navigate(`/modification/bien/${id}`, { state: { bienData: bien } });
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>Erreur : {error}</p>;
  }

  if (!bien) {
    return <p>Bien non trouvé.</p>;
  }

  return (
    <div className='w-full'>
      <div className="bg-white mb-2 shadow-lg rounded-lg">
        <Nav />
      </div>
      <div className="p-8">
        {modificationEnCours ? (
          <Formulaire bien={bienAModifier} onModificationTerminee={handleModificationTerminee} bienId={id} />
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">{bien.titre}</h1>
            <div className="mb-4">
              <strong>Adresse:</strong> {bien.adresse}
            </div>
            <div className="mb-4">
              <strong>Type:</strong> {bien.type}
            </div>
            <div className="mb-4">
              <strong>Loyer:</strong> {bien.loyer} €
            </div>
            <div className="mb-4">
              <strong>Surface:</strong> {bien.surface} m²
            </div>
            <button
              onClick={supprimerBien}
              disabled={suppressionEnCours}
              className="!bg-red-500 !hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              {suppressionEnCours ? "Suppression..." : "Supprimer"}
            </button>
            <button
              onClick={modifierBien}
              disabled={modificationEnCours}
              className="!bg-yellow-500 !hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              {modificationEnCours ? "Modification..." : "Modifier"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {suppressionReussie && <p className="text-green-500 mt-2">Bien supprimé avec succès !</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default DetailBien;