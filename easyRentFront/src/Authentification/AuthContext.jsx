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
  const [rawToken, setRawToken] = useState(localStorage.getItem("token") || "");
  const [token, setToken] = useState(parseToken(rawToken));
  const [userID, setUserID] = useState(localStorage.getItem("userId") || "");

  function parseToken(storedToken) {
    try {
      const parsedToken = JSON.parse(storedToken);
      if (parsedToken && typeof parsedToken === 'object' && parsedToken.token) { // Correction ici: recherche de 'token'
        return parsedToken.token;
      }
      return storedToken || "";
    } catch (error) {
      return storedToken || "";
    }
  }

  //fonction pour enregistrer le token dans le local storage
  function updateToken(newToken) {
    setRawToken(newToken);
    setToken(parseToken(newToken));
    localStorage.setItem("token", typeof newToken === 'object' ? JSON.stringify(newToken) : newToken);
  }

  //fonction de déconnexion passant par la suppression des données présente dans le LocalStorage
  function logOut() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");

    setRawToken("");
    setToken("");
    setUserID("");
  }

  return (
    <AuthContext.Provider
      value={{
        rawToken,
        token,
        setRawToken,
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