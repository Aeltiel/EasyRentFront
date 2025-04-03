import { useState } from "react";
import { useAuth } from "../Authentification/AuthContext";

function FormulaireLoc({ bienId, onLocataireAjoute }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateEntree, setDateEntree] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic field validation
    if (!nom || !prenom || !email || !telephone || !dateEntree) {
      setMessage("Tous les champs doivent être remplis.");
      return;
    }

    if (!bienId) {
      setMessage("L'ID du bien n'a pas été correctement transmis.");
      return;
    }

    const locataireData = {
      nom,
      prenom,
      email,
      telephone,
      dateEntree,
      biens: `/api/biens/${bienId}`,
      paiements: [],
    };

    try {
      const response = await fetch("http://localhost:8080/api/locataires", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locataireData),
      });

      if (response.ok) {
        setMessage("Locataire ajouté avec succès !");
        setNom("");
        setPrenom("");
        setEmail("");
        setTelephone("");
        setDateEntree("");
        if (onLocataireAjoute) {
          onLocataireAjoute(); // Appeler la fonction de callback
        }
      } else {
        const errorData = await response.json();
        setMessage(`Erreur lors de l'ajout du locataire: ${errorData?.message || 'Détails non disponibles'}`);
      }
    } catch (error) {
      setMessage("Erreur réseau lors de l'ajout du locataire.");
      console.error("Erreur réseau:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Ajouter un locataire</h2>
      <form className="w-full max-w-lg" onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="nom"
            >
              Nom
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              placeholder="Nom"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="prenom"
            >
              Prénom
            </label>
            <input
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="Prénom"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              placeholder="email@example.com"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="telephone"
            >
              Téléphone
            </label>
            <input
              id="telephone"
              type="tel"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              placeholder="06XXXXXXXX"
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="dateEntree"
            >
              Date d'entrée
            </label>
            <input
              id="dateEntree"
              type="datetime-local"
              value={dateEntree}
              onChange={(e) => setDateEntree(e.target.value)}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="!bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Ajouter le locataire
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-4 text-center text-gray-700">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

export default FormulaireLoc;