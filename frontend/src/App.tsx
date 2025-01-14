import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages Import
import { Home } from "./pages/home/Home";
import { Register } from "./pages/register/Register";
import { Login } from "./pages/login/Login";

// Components Import
import { Sidebar } from "./components/sidebar/Sidebar";

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="App-Content">
          <Routes>
            <Route element={<Home />} path="/" />
            <Route element={<Register />} path="/register" />
            <Route element={<Login />} path="/login" />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
