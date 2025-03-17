import {LevelItem} from "../types.ts";
import PuzzleVisualization from "../components/PuzzleVisualization.tsx";
import PuzzleInput from "../components/PuzzleInput.tsx";
import PuzzleOutput from "../components/PuzzleOutput.tsx";
import PuzzleDetails from "../components/PuzzleDetails.tsx";
import "./PuzzleUI.css"

export default function PuzzleUI(props: { level: LevelItem }) {
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
        </div>
    )
}