import { useState } from "react";
import { useAuth } from "../../Authentification/AuthContext";
import './LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Importer le hook personnalisé pour l'authentification
  const {updateToken} = useAuth(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    const loginData = { email, password };

    try {
      setLoading(true);

      const response = await fetch('http://localhost:8080/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Connexion échouée');
        setLoading(false); 
        return;
      }

      const data = await response.json();
      // Enregistrer le token dans le localStorage
      updateToken(data); // Appeler la fonction pour mettre à jour le token
      console.log('Connexion réussie', data);

      window.location.href = '/';

      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur de connexion');
      setLoading(false); 
    }
  }

  return (
    <>
      <div className="flex min-h-full justify-center shadow-lg">
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-12 bg-white">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="/assets/img/logo.png"
              alt="Logo"
            />
            <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
              Connexion
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    placeholder='Email'
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="mt-2">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    placeholder='Mot de passe'
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md !bg-blue-500 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-indigo-600"
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Connexion'}
                </button>
              </div>
            </form>

            {error && (
              <p className="mt-10 text-center text-sm text-red-500">{error}</p>
            )}

          </div>
        </div>

        <div className='!bg-gray-800 text-white flex items-center justify-center px-8'>
          <h1>Votre espace candidat sécurisé</h1>
        </div>

      </div>
    </>
  );
}

export default LoginPage;
