import { Link } from "react-router-dom";
import './Game.css';

const Game = () => {
    return (
        <div className="game-home-container">
            <div className="game-home-content">
                <h1>Welcome to SpiderChip!</h1>
                <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', paddingTop: '1em' }}>
                    <Link className="primary-button" to="/level-select">Level Select</Link>
                    <Link className="primary-button" to="/puzzle/sandbox">Code Sandbox</Link>
                    <Link className="primary-button" to="/about">About SpiderChip</Link>
                </div>
            </div>
        </div>
    );
};

export default Game;
