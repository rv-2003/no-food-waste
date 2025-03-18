import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import AboutUs from "./Pages/AboutUs"; // Create this component
import Donate from "./Pages/Donate"; // Create this component
import UserProfile from "./Pages/profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Signup Page */}
        <Route path="/signup" element={<Signup />} />

        {/* About Page */}
        <Route path="/about" element={<AboutUs />} />

        {/* Donate Page */}
        <Route path="/donate" element={<Donate />} />

        {/* User Profile Page */}
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;

