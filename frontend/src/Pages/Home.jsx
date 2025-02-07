import Header from "../Component/Header.jsx";
import Footer from "../Component/Footer.jsx";
import CustomScrollbar from "../Component/Scrollbar.jsx";
import Image from "../assets/Background.jpg";
import "./home.css";
function Home() {
  return (
    <>
      <div className="header">
        <Header />
      </div>
      <div className="Body"><p></p>
        <CustomScrollbar/>
        
        </div>
      <div><Footer/></div>
    </>
  );
}

export default Home;