// components/Nav.js

import { Link } from "react-router-dom";

function Nav() {
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
          <Link to="" className="!text-red">Déconnexion</Link>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
