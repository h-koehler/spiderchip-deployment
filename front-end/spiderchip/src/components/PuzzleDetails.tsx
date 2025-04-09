import {LevelItem} from "../types.ts";
import "./PuzzleDetails.css"

export default function PuzzleDetails(props: { level: LevelItem }) {
    return (
        <div className="details">
            <div className="text">
                <p>{props.level.description}</p>
            </div>
        </div>
    )
}