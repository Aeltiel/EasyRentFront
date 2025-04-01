import { Routes, Route } from "react-router-dom";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";



function App() {
  return(
    <div className="flex min-h-screen min-w-screen justify-center items-center">
      <Routes>
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </div>
  )
}

export default App
