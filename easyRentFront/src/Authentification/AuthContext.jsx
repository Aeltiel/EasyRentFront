import { createContext, useContext, useState } from "react";

/*Ce fichier me permet de créer un hook personnalisé qui va gérer le système d'authentification
de l'application, via le createContext et le useContext.
En enregistrant le token dans le localStorage ainsi que dans le state, me permet d'avoir accès
à ce dernier n'importe quand sans me soucier du rafraîchissement de la page ou d'un changement
de page
*/

const AuthContext = createContext(); //création du contexte d'authentification

//le provider qui va englober mon application et permettre l'usage du hook personnaliser partout où il faut
export function AuthProvider({ children }) {
  const [token, setToken] = useState(getTokenFromLocalStorage());
  const [userID, setUserID] = useState(localStorage.getItem("userId") || "");

  function getTokenFromLocalStorage() {
    const storedToken = localStorage.getItem("token");
    try {
      // Tente de parser la valeur stockée comme un objet JSON
      const parsedToken = JSON.parse(storedToken);
      // Si c'est un objet et qu'il a une propriété contenant le token (adaptez 'accessToken' à votre cas)
      if (parsedToken && typeof parsedToken === 'object' && parsedToken.accessToken) {
        return parsedToken.accessToken;
      }
      // Si ce n'est pas un objet JSON valide ou ne contient pas la propriété attendue, retourne la valeur brute
      return storedToken || "";
    } catch (error) {
      // Si le parsing échoue (ce n'est pas un JSON), retourne la valeur brute
      return storedToken || "";
    }
  }

  //fonction pour enregistrer le token dans le local storage
  function updateToken(newToken) {
    setToken(newToken);
    // Si newToken est un objet, stockez-le en tant que chaîne JSON
    localStorage.setItem("token", typeof newToken === 'object' ? JSON.stringify(newToken) : newToken);
  }

  //fonction de déconnexion passant par la suppression des données présente dans le LocalStorage
  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setToken("");
    setUserID("");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        userID,
        setUserID,
        updateToken,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//création d'un hook personnaliser pour utiliser mon context partout où j'en ai besoin
export function useAuth() {
  return useContext(AuthContext);
}