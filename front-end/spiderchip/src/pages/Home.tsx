import './Home.css';
import { useNavigate } from 'react-router-dom';
import Logo from "../assets/images/logo.svg";

const Home = () => {
  const navigate = useNavigate()

  const handleStartClick = () => {
      navigate("/game");
  };

  const handleAboutClick = () => {
        navigate("/about");
  }

  return (
    <div className="container">
      <img src={Logo} className="logo" alt="Spiderchip Logo"/>
      <p className="subtitle">an algorithms game</p>
      <button className="startButton" onClick={handleStartClick}>
        START
      </button>
      <button className="startButton" onClick={handleAboutClick}>
        ABOUT
       </button>
    </div>
  );
};

export default Home;
