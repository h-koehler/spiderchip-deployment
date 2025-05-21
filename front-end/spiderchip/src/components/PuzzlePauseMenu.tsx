import "./PuzzlePauseMenu.css"
import {Link} from "react-router-dom";
import PauseIcon from '../assets/images/pause-icon.svg'

export default function PuzzlePauseMenu( props: {
    onResume: () => void,
    onQuit: () => void,
    levelOrSand: "" | "SAVE & ",
}) {

    return (
        <div className="menu-overlay">
            <div className="pause-menu">
                <div className="header">
                    <img src={PauseIcon} />
                </div>
                <div className="buttons">
                    <button className="primary-button" onClick={props.onResume}>RESUME</button>
                    <Link to="/about/language" target="_blank" className="primary-button">MANUAL</Link>
                    <button className="primary-button" onClick={props.onQuit}>{props.levelOrSand}QUIT</button>
                </div>
            </div>
        </div>
    )
}
