import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../Authentification/AuthContext';
import Nav from './Nav';

function FormulaireLocataireModification() {
  const location = useLocation();
  console.log('location.state:', location.state);
  const locataireData = location.state?.locataireData;
  const idBiens = location.state?.idBiens;
  const navigate = useNavigate();
  const { id } = useParams();

  const [nom, setNom] = useState(locataireData?.nom || '');
  const [prenom, setPrenom] = useState(locataireData?.prenom || '');
  const [email, setEmail] = useState(locataireData?.email || '');
  const [telephone, setTelephone] = useState(locataireData?.telephone || '');
  const [dateEntree, setDateEntree] = useState(locataireData?.dateEntree ? new Date(locataireData.dateEntree).toISOString().split('T')[0] : '');
  const [message, setMessage] = useState('');

  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const biens = `http://localhost:8080/api/biens/${idBiens}`
    try {
      const response = await fetch(`http://localhost:8080/api/locataires/${locataireData.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          telephone,
          dateEntree,
          biens
        }),
      });

      if (response.ok) {
        setMessage('Locataire modifié avec succès !');
        navigate(`/bien/${idBiens}`);
      } else {
        setMessage('Erreur lors de la modification du locataire.');
      }
    } catch (error) {
      setMessage('Erreur réseau.');
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="bg-white mb-2 shadow-lg rounded-lg">
          <Nav />
        </div>
      <h1 className="text-2xl font-bold mb-4">Modification locataire</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nom">Nom</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="nom" type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prenom">Prénom</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="prenom" type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">Téléphone</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="telephone" type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateEntree">Date d'entrée</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="dateEntree" type="date" value={dateEntree} onChange={(e) => setDateEntree(e.target.value)} />
        </div>
        <div className="flex items-center justify-between">
          <button className="!bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Modifier</button>
        </div>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}

export default FormulaireLocataireModification;