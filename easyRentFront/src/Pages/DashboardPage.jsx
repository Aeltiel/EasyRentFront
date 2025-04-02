import { useAuth } from "../Authentification/AuthContext";
import { useLocation } from "react-router-dom";

function DashboardPage() {
  const location = useLocation();
  const { token } = useAuth(); // Utiliser le hook personnalisé pour obtenir le token


  if (loading){
    return <div>Chargement en cours</div>;
  }
  if(token){
    return (
      <div>
        <h1>Dashboard</h1>
        <p>Welcome to the Dashboard!</p>
      </div>
    );
  }
}
export default DashboardPage;