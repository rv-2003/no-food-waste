import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AboutUs from "./Pages/AboutUs";
import Donate from "./Pages/Donate";
import Dashboard from "./Pages/dashboard"; 
import UserProfile from "./Pages/Profile";
import ProtectedRoute from "./Component/ProtectedRoute"; // ✅ Import Protected Route

function App() {
  useEffect(() => {
    const handleTabClose = () => {
      sessionStorage.removeItem("token"); // ✅ Remove token on tab close
    };

    window.addEventListener("beforeunload", handleTabClose);
    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/donate" element={<Donate />} />

        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<UserProfile />} />} />

      </Routes>
    </Router>
  );
}

export default App;






