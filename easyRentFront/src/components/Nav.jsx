// components/Nav.js

import { Link } from "react-router-dom";
import { useAuth } from "../Authentification/AuthContext";

function Nav() {
  const { logOut } = useAuth();

  return (
    <nav className="bg-white p-4 w-full rounded-sm">
      <div className="flex justify-between items-center ">
        <div className="text-white text-2xl">
            <img
              className="mx-auto h-10 w-auto"
              src="/assets/img/logo.png"
              alt="Logo"
            />
        </div>
        <div className="space-x-4 text-black">
          <Link to="/" className="!text-black">Accueil</Link>
          <Link to="/bien" className="!text-black">Mes biens</Link>
          <Link to="/locataires" className="!text-black">Mes locataires</Link>
          <Link to="/payments" className="!text-black">Paiements</Link>
          <button 
            onClick={logOut} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
