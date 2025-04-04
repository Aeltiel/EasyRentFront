import { useState, useEffect } from "react";
import { useAuth } from "../Authentification/AuthContext";

function FormulaireLoc({ bienId, onLocataireAjoute, locataire }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [dateEntree, setDateEntree] = useState("");
  const [message, setMessage] = useState("");
  const { token } = useAuth();
  const isModification = !!locataire;

  useEffect(() => {
    if (locataire) {
      setNom(locataire.nom);
      setPrenom(locataire.prenom);
      setEmail(locataire.email);
      setTelephone(locataire.telephone);
      setDateEntree(locataire.dateEntree ? new Date(locataire.dateEntree).toISOString().slice(0, 16) : "");
    } else {
      // Réinitialiser l'état si locataire est null (mode ajout)
      setNom("");
      setPrenom("");
      setEmail("");
      setTelephone("");
      setDateEntree("");
    }
  }, [locataire]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom || !prenom || !email || !telephone || !dateEntree) {
      setMessage("Tous les champs doivent être remplis.");
      return;
    }

    if (!bienId && !isModification) {
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
      const url = isModification
        ? `http://localhost:8080/api/locataires/${locataire.id}`
        : "http://localhost:8080/api/locataires";
      const method = isModification ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locataireData),
      });

      if (response.ok) {
        setMessage(isModification ? "Locataire modifié avec succès !" : "Locataire ajouté avec succès !");
        if (!isModification) {
          window.location.reload();
          setNom("");
          setPrenom("");
          setEmail("");
          setTelephone("");
          setDateEntree("");
          if (onLocataireAjoute) {
            onLocataireAjoute();
          }
        }
      } else {
        const errorData = await response.json();
        setMessage(`Erreur lors ${isModification ? "de la modification" : "de l'ajout"} du locataire: ${errorData?.message || 'Détails non disponibles'}`);
      }
    } catch (error) {
      setMessage(`Erreur réseau lors ${isModification ? "de la modification" : "de l'ajout"} du locataire.`);
      console.error("Erreur réseau:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">{isModification ? "Modifier le locataire" : "Ajouter un locataire"}</h2>
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
            className={`!bg-${isModification ? "blue" : "green"}-500 hover:bg-${isModification ? "blue" : "green"}-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            type="submit"
          >
            {isModification ? "Modifier le locataire" : "Ajouter le locataire"}
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