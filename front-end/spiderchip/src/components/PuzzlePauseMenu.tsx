import "./PuzzlePauseMenu.css"
import {useEffect} from "react";
import PauseIcon from '../assets/images/pause-icon.png'

export default function PuzzlePauseMenu( props: {
    setMenuIsOpen: (isOpen: boolean) => void
}) {
    const handleEscKey = (event: KeyboardEvent) => {
        // const menu = document.querySelector(".pause-menu");
        if (event.key === "Escape") {
            props.setMenuIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleEscKey);
        return () => document.removeEventListener("keydown", handleEscKey);
    }, [])

    return (
        <div className="menu-overlay">
            <div className="pause-menu">
                <div className="header">
                    <img src={PauseIcon} />
                </div>
                <div className="buttons">
                    <button className="primary-button" onClick={() => props.setMenuIsOpen(false)}>RESUME</button>
                    <button className="primary-button">SETTINGS</button>
                    <button className="primary-button">QUIT</button>
                </div>
            </div>
        </div>
    )
}