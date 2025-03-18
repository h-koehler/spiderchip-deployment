import {LevelItem} from "../types.ts";
import PuzzleVisualization from "../components/PuzzleVisualization.tsx";
import PuzzleInput from "../components/PuzzleInput.tsx";
import PuzzleOutput from "../components/PuzzleOutput.tsx";
import PuzzleDetails from "../components/PuzzleDetails.tsx";
import "./PuzzleUI.css"
import {useEffect, useState} from "react";
import PuzzlePauseMenu from "../components/PuzzlePauseMenu.tsx";

export default function PuzzleUI(props: { level: LevelItem }) {
    const [menuIsOpen, setMenuIsOpen] = useState(false);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMenuIsOpen(prev => !prev);
            }
        };

        document.addEventListener("keydown", handleEscKey);
        return () => document.removeEventListener("keydown", handleEscKey);
    }, [])

    return (
        <div className="puzzle-layout">
            <div className="input-container">
                <PuzzleInput/>
            </div>
            <div className="visualization-container">
                <PuzzleVisualization/>
            </div>
            <div className="output-container">
                <PuzzleOutput/>
            </div>
            <div className="details-container">
                <PuzzleDetails level={props.level}/>
            </div>

            {menuIsOpen && <PuzzlePauseMenu setMenuIsOpen={setMenuIsOpen} />}
        </div>
    )
}