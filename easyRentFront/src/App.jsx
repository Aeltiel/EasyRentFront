import { Routes, Route } from "react-router-dom";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage";



function App() {
  return(
    <Routes>
      <Route path="/" element={<DashboardPage/>} />
      <Route path="/login" element={<LoginPage/>} />
    </Routes>
  )
}

export default App
