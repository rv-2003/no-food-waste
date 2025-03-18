import { Link } from "react-router-dom";
import Header from "../Component/Header.jsx";
import Footer from "../Component/Footer.jsx";
import CustomScrollbar from "../Component/Scrollbar.jsx";
import "./home.css";

function Home() {
  return (
    <>
      <div className="header">
        <Header />
      </div>
      <div className="Body">
        <CustomScrollbar />
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Home;