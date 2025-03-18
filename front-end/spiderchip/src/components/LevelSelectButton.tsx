import {LevelItem} from "../types";
import "./LevelSelectButton.css"
import CompletedIcon from '../assets/images/completed-icon.png';
import SkippedIcon from '../assets/images/skipped-icon.png';

export default function LevelSelectButton(props: {
    level: LevelItem,
    setSelectedLevel: (level: LevelItem) => void,
    updateLevelStatus: (levelId: number, newStatus: string) => void;
}) {
    // const navigate = useNavigate();

    // const getLevelClass = (status: string) => {
    //     return status === "not-available" ? "not-available" : "available"
    // }

    const handleLevelOnClick = () => {
        props.setSelectedLevel(props.level)
    }

    const renderStatusIcon = () => {
        switch (props.level.status) {
            case "completed":
                return <img src={CompletedIcon}/>
            case "skipped":
                return <img src={SkippedIcon}/>
            default:
                return null;
        }
    }

    return (
        <li key={props.level.id}>
            <button
                className="level-button"
                onClick={() => handleLevelOnClick()}
                disabled={props.level.status === "not-available"}
            >
                <h2>{props.level.title}</h2>
                <h3>{props.level.category}</h3>
                <div className="status-icon">
                    {renderStatusIcon()}
                </div>
            </button>
        </li>
    )
}