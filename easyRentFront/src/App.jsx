// App.js

import { Routes, Route } from "react-router-dom";
import DashboardPage from "./Pages/DashboardPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import BienPage from "./Pages/BienPage/BienPage";
import BienList from "./components/ListsBien/ListBien";
import DetailBien from "./components/DetailBien";

function App() {

  return(

    <div className="flex min-h-screen min-w-screen justify-center items-center">
      <Routes>
        <Route element={<AuthRoute/>}>
        <Route path="/" element={<DashboardPage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/bien" element={<BienPage />} />
        <Route path="/bien/:id" element={<DetailBien />} />
      </Route>
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </div>

  );
}

export default App;
