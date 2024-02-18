import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import LoginPage from "./components/LoginPage/LoginPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
