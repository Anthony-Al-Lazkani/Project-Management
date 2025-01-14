import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
// Pages Import
import { Home } from "./pages/home/Home";
import { Register } from "./pages/register/Register";
import { Login } from "./pages/login/Login";

// Components Import
import { Sidebar } from "./components/sidebar/Sidebar";
import { PrivateRoute } from "./components/private-route/PrivateRoute";
import { useAuth } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
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
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
