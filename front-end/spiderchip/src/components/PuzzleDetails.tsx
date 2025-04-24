import { LevelItem } from "../types.ts";
import "./PuzzleDetails.css"

export default function PuzzleDetails(props: { extraClass?: string, level: LevelItem }) {
    return (
        <div className={"details " + (props.extraClass ?? "")}>
            <p>{props.level.description}</p>
        </div>
    )
}
