import { Routes, Route } from "react-router-dom";
import AuthRoute from "./Authentification/AuthRoutes";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";



function App() {
  return(

    <div className="flex min-h-screen min-w-screen justify-center items-center">
      <Routes>
        {/*<Route element={<AuthRoute/>}>
        <Route path="/" element={<DashboardPage/>} />
      </Route>*/}
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </div>

  )
}

export default App
