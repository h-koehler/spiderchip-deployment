import {LevelItem} from "../types.ts";
import "./PuzzleDetails.css"

export default function PuzzleDetails(props: { level: LevelItem }) {
    return (
        <div className="details">
            <div className="text">
                <h2>{props.level.title}</h2>
                <p>{props.level.description}</p>
            </div>
        </div>
    )
}