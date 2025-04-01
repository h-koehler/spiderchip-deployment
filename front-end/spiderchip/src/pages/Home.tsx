import './Home.css';
import { useState } from "react";
import AuthModal from "../components/AuthModal";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate()

  const handleStartClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/game");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="container">
      <h1 className="title">SPiderchip</h1>
      <p className="subtitle">an algorithms game</p>
      <button className="startButton" onClick={handleStartClick}>
        START
      </button>

      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Home;