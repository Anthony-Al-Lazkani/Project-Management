import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";


// Pages Import
import { Home } from "./pages/home/Home";
import { Register } from "./pages/register/Register";
import { Login } from "./pages/login/Login";
import { Projects } from "./pages/projects/Projects";


// Components Import
import { Sidebar } from "./components/sidebar/Sidebar";
import { PrivateRoute } from "./components/private-route/PrivateRoute";

function App() {
  return (
      <Router>
        <div className="App">
          <Sidebar />
          <div className="App-Content">
            <Routes>
              <Route element={<Register />} path="/register" />
              <Route element={<Login />} path="/login" />

              {/* Protected Routes */}
              <Route element={<PrivateRoute />}>
                <Route element={<Home />} path="/" />
                <Route element={<Projects />} path="/projects" />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
