import {LevelItem} from "../types.ts";
import {useNavigate} from "react-router-dom";
import "./PuzzleDetailPopUp.css"

export default function PuzzleDetailsPopUp(props: {
    level: LevelItem,
    setSelectedLevel: (level: LevelItem | null) => void,
    updateLevelStatus: (levelId: number, newStatus: string) => void
}) {
    const navigate = useNavigate();

    const handleSkippedChange = () => {
        const newStatus = props.level.status === "skipped" ? "available" : "skipped";
        props.updateLevelStatus(props.level.id, newStatus);
    }

    const handleStartGame = () => {
        props.setSelectedLevel(props.level);
        navigate("/puzzle-ui");
    }

    return (
        <div className="puzzle-details-window">
            <div className="puzzle-details">
                <div>
                    <h1>{props.level.title}</h1>
                    <h2>{props.level.category}</h2>
                </div>
                <p>Level Lore Goes Here. Lorem ipsum odor amet, consectetuer adipiscing elit. Sapien magnis integer nascetur nullam porttitor quam fusce litora.</p>
                <div>
                    <h3>Instructions</h3>
                    <p>{props.level.description}</p>
                </div>
            </div>
            <div className="puzzle-details-buttons">
                <button className="primary-button" onClick={handleStartGame}>Start</button>
                <div className="skipped-checkbox">
                    {props.level.status === "completed" ? (
                        <span>Completed</span>
                    ) : (
                        <input
                            type="checkbox"
                            onChange={handleSkippedChange}
                            checked={props.level.status === "skipped"}
                            disabled={props.level.status === "completed" || props.level.status === "not-available"}
                        />
                    )}
                    {props.level.status !== "completed" && <label>Skip</label>}
                </div>
            </div>
        </div>
    )
}