import "./Header.css";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom"; // Import useNavigate

export default function Header() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <>
      <h1 className="logo">Feeding Forward</h1>
      <div className="buttons">
        {/* AboutUs Button */}
        <Button variant="contained" onClick={() => navigate("/about")}>
          AboutUs
        </Button>

        {/* Login/Register Button */}
        <Button variant="contained" onClick={() => navigate("/login")}>
          Login/Register
        </Button>

        {/* Donate Button */}
        <Button variant="contained" onClick={() => navigate("/donate")}>
          Donate
        </Button>
      </div>
    </>
  );
}
