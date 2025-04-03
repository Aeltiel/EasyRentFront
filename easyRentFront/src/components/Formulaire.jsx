import { useState } from "react";
import { useAuth } from "../Authentification/AuthContext";
 // Importer le composant Nav


function Formulaire() {
  // Initialiser les états pour chaque champ
  const [titre, setTitre] = useState("");
  const [loyer, setLoyer] = useState(0);
  const [type, setType] = useState("Appartement");
  const [surface, setSurface] = useState(0);
  const [ville, setVille] = useState("");
  const [rue, setRue] = useState("");
  const [codePostal, setCodePostal] = useState("");
  const [message, setMessage] = useState("");
  const [numeros, setNum] = useState("");
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();


    // Vérification basique des champs
    if (!titre || !loyer || !surface || !ville || !rue || !codePostal) {
      setMessage("Tous les champs doivent être remplis.");
      return;
    }

    const adresse = `${numeros} ${rue} ${codePostal} ${ville}`;
    const users = "http://localhost:8080/api/users/1";

    const bienData = {
      titre,
      loyer,
      type,
      surface,
      adresse,
      users,
    };


    try {
      const response = await fetch("http://localhost:8080/api/biens", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bienData),
      });

      if (response.ok) {
        setMessage("Bien ajouté avec succès !");
      } else {
        setMessage("Erreur lors de l'ajout du bien.");
      }
    } catch (error) {
      setMessage("Erreur réseau.");
    }
  };

  return (
    <>
    <div className="p-8">
      
    <h1 className="mb-6">Ajouter un bien</h1>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <h3>Nouveau bien</h3>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="titre"
            >
              Titre
            </label>
            <input
              id="titre"
              type="text"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              placeholder="Ex: Appartement Paris"
            />
          </div>
        </div>

        <h3>Adresse</h3>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="ville"
            >
              Ville
            </label>
            <input
              id="ville"
              type="text"
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="Paris"
            />
          </div>

          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="codePostal"
            >
              N°
            </label>
            <input
              id="codePostal"
              type="text"
              value={numeros}
              onChange={(e) => setNum(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="36"
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="rue"
            >
              Rue
            </label>
            <input
              id="rue"
              type="text"
              value={rue}
              onChange={(e) => setRue(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="Edouard Michelin"
            />
          </div>
          
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="codePostal"
            >
              Code Postal
            </label>
            <input
              id="codePostal"
              type="text"
              value={codePostal}
              onChange={(e) => setCodePostal(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="90210"
            />
          </div>
        </div>

        <h3>Infos du logment</h3>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/3 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="loyer"
            >
              Loyer
            </label>
            <input
              id="loyer"
              type="number"
              value={loyer}
              onChange={(e) => setLoyer(Number(e.target.value))} // Convertir en number ici
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="100€"
            />
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="type"
            >
              Type
            </label>
            <div className="relative">
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white"
              >
                <option>Appartement</option>
                <option>Maison</option>
                <option>Studio</option>
              </select>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="surface"
            >
              Surface (m²)
            </label>
            <input
              id="surface"
              type="number"
              value={surface}
              onChange={(e) => setSurface(Number(e.target.value))} // Convertir en number ici aussi
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="60"
            />
          </div>
        </div>

     

        <div className="flex items-center justify-between">
          <button
            className="!bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Ajouter
          </button>
        </div>

      </form>

      {message && (
        <div className="mt-4 text-center text-gray-700">
          <p>{message}</p>
        </div>
      )}

    </div>
    </>
  );
}

export default Formulaire;
