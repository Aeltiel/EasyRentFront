import React, { useState, useEffect } from "react";
import Nav from "../../components/Nav";
import { useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../Authentification/AuthContext";
import bienTypes from "../../data/bienTypes.json";

function ModificationPage() {
  const { id } = useParams();
  const location = useLocation();
  const bienData = location.state?.bienData;

  // États initialisés vides
  const [titre, setTitre] = useState("");
  const [loyer, setLoyer] = useState(0);
  const [type, setType] = useState("Appartement");
  const [surface, setSurface] = useState(0);
  const [adresse, setAdresse] = useState(""); // adresse sous forme d'une chaîne unique
  const [message, setMessage] = useState("");
  const { token } = useAuth();

  // 🟢 Utiliser useEffect pour mettre à jour les états lorsque bienData est disponible
  useEffect(() => {
    if (bienData) {
      setTitre(bienData.titre || "");
      setLoyer(bienData.loyer || 0);
      setType(bienData.type || "Appartement");
      setSurface(bienData.surface || 0);
      setAdresse(bienData.adresse || "");  // adresse sous forme de chaîne
    }
  }, [bienData]); // 🔥 Se déclenche uniquement quand bienData change

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titre || !loyer || !surface || !adresse) {
      setMessage("Tous les champs doivent être remplis.");
      return;
    }

    const adresseParts = adresse.split(" ");
    const numero = adresseParts[0] || "";
    const rue = adresseParts.slice(1, -2).join(" ") || "";
    const codePostal = adresseParts[adresseParts.length - 2] || "";
    const ville = adresseParts[adresseParts.length - 1] || "";

    const users = "http://localhost:8080/api/users/1";
    const actif = true;
    const locataire = [];

    const bienDataToSend = {
      titre,
      loyer,
      type,
      surface,
      adresse: `${numero} ${rue} ${codePostal} ${ville}`,
      users,
      actif,
      locataire
    };

    try {
      const response = await fetch(`http://localhost:8080/api/biens/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bienDataToSend),
      });

      if (response.ok) {
        setMessage("Bien modifié avec succès !");
      } else {
        setMessage("Erreur lors de la modification du bien.");
      }
    } catch (error) {
      setMessage("Erreur réseau.");
    }
  };

  return (
    <>
      <div className="w-full">
        

        <h1 className="mb-6">Modifier un bien</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <h3>Modifier un bien</h3>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="titre">
                Titre
              </label>
              <input
                id="titre"
                type="text"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          <h3>Adresse</h3>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="adresse">
                Adresse (Numéro, Rue, Code Postal, Ville)
              </label>
              <input
                id="adresse"
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                placeholder="123 Rue Exemple, 75001 Paris"
              />
            </div>
          </div>

          <h3>Infos du logement</h3>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/3 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="surface">
                Surface (m²)
              </label>
              <input
                id="surface"
                type="number"
                value={surface}
                onChange={(e) => setSurface(Number(e.target.value))}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                placeholder="60"
              />
            </div>
            <div className="w-full md:w-1/3 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="loyer">
                Loyer
              </label>
              <input
                id="loyer"
                type="number"
                value={loyer}
                onChange={(e) => setLoyer(Number(e.target.value))}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              />
            </div>
            <div className="w-full md:w-1/3 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="type">
                Type de bien
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              >
                {bienTypes.types.map((typeOption) => (
                  <option key={typeOption} value={typeOption}>{typeOption}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="!bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Modifier
            </button>
          </div>
        </form>

        {message && <div className="mt-4 text-center text-gray-700"><p>{message}</p></div>}
      </div>
    </>
  );
}

export default ModificationPage;
