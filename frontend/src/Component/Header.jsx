
import "./Header.css";
import Button from '@mui/material/Button';

export default function Header() {
    return (
          <>
          <h1 className="logo">Feeding Forward</h1>
          <div className="buttons">
          <Button variant="contained">AboutUs</Button>
          <Button variant="contained">Login/Register</Button>
          <Button variant="contained">Donate</Button>
          </div>
          </>  
    );
}
