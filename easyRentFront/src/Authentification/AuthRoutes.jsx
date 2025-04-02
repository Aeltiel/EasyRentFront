import {  Navigate, Outlet } from "react-router-dom";
//import { useAuth } from "./AuthContext";

/*
Ce fichier, sert à privatiser les routes afin que seul les personnes authentifier puisse
y accéder. POur cela on récupère le token, et on fait une ternaire. Si le token est bon
on accède à la page voulu, sinon, on est renvoyer vers la page d'accueil
*/
function AuthRoute() { 
    const { token } = useAuth();

    return token ?
        <Outlet/>
        : <Navigate to="/" />;
}

export default AuthRoute;