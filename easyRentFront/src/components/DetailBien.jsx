import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from './Nav';
import { useAuth } from '../Authentification/AuthContext';

function DetailBien() {
  const { id } = useParams(); // Récupère l'ID du bien depuis l'URL
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  useEffect(() => {
    const fetchBien = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/biens/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        }); // Remplacez par votre URL d'API
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
    </div>
    </div>

  );
}

export default DetailBien;