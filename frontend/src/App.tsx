import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Pages Import
import { Home } from "./pages/home/Home";

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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
