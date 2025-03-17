import {LevelItem} from "../types";
import "./LevelSelectButton.css"
import {useState} from "react";
import { useNavigate } from "react-router-dom";

export default function LevelSelectButton(props: { level: LevelItem }) {
    const navigate = useNavigate()
    const [status, setStatus] = useState<string>(props.level.status)
    const idString = String(props.level.id)

    // const getLevelClass = (status: string) => {
    //     return status === "not-available" ? "not-available" : "available"
    // }

    const handleLevelOnClick = () => {
        navigate('/puzzle-ui', {state: props.level})
    }

    const handleSkippedChange = () => {
        setStatus(prevStatus => (prevStatus === "skipped") ? "available" : "skipped")
    }

    return (
        <li key={props.level.id}>
            <button
                className="level-button"
                onClick={() => handleLevelOnClick()}
                disabled={status === "not-available"}>
                <h3>{props.level.title}</h3>
                <h4>{props.level.category}</h4>
            </button>
            <div className="skipped-checkbox">
                {status === "completed" ? (
                    <span>Completed</span>
                ) : (
                <input
                    type="checkbox"
                    name={props.level.title}
                    id={idString}
                    onChange={() => handleSkippedChange()}
                    checked={status === "skipped"}
                    disabled={status === "completed" || status === "not-available"}/>
                )}
                {status !== "completed" && <label>Skip</label>}
            </div>
        </li>
    )
}