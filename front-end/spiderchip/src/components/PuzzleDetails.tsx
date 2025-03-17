import {LevelItem} from "../types.ts";
import DetailsIcon from '../assets/images/details-icon.png'
import "./PuzzleDetails.css"

export default function PuzzleDetails(props: { level: LevelItem }) {
    return (
        <div className="details">
            <div className="header">
                <img src={DetailsIcon}/>
            </div>
            <h2>{props.level.title}</h2>
            <p>{props.level.description}</p>
        </div>
    )
}