import {useNavigate} from "react-router-dom";
import './Game.css'

const Game = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/level-select");
    }

    return (
        <div className="game-home-container">
            <div className="game-home-content">
                <h1>Welcome to the Game!</h1>
                <button className="primary-button" onClick={handleClick}>Go to Level Select</button>
            </div>
        </div>
    );
};

export default Game;
