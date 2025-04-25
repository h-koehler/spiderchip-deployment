import { LevelItem, LevelItemType, LevelStatus } from "../types.ts";
import { useNavigate } from "react-router-dom";
import paperBkg from "../assets/images/paper-background.svg"
import "./LevelDetailPopUp.css"
import { useEffect, useState } from "react";
import { StoryBeatType } from "./StoryDefinitions.ts";

export default function LevelDetailPopUp(props: {
    level: LevelItem,
    updateLevelStatus: (level: LevelItem, newStatus: LevelStatus) => void;
}) {
    const navigate = useNavigate();
    const [isChecked, setIsChecked] = useState(props.level.status === LevelStatus.SKIPPED);
    const [isDisabled, setIsDisabled] = useState(props.level.status !== LevelStatus.AVAILABLE);

    useEffect(() => {
        setIsChecked(props.level.status === LevelStatus.SKIPPED);
        setIsDisabled(props.level.status !== LevelStatus.AVAILABLE);
    }, [props.level])

    const handleCheckboxChange = () => {
        if (!isChecked) {
            setIsChecked(true);
            setIsDisabled(true);
            props.updateLevelStatus(props.level, LevelStatus.SKIPPED);
        }
    }

    const handleStartClick = () => {
        if (props.level.type === LevelItemType.PUZZLE) {
            navigate(`/puzzle/${props.level.id}`);
        } else if (props.level.type === LevelItemType.STORY) {
            navigate(`/story/${props.level.id}`);
        } else {
            throw new Error("Cannot start unknown level type");
        }
    }

    return (
        <div className="puzzle-details-window">
            <img src={paperBkg} alt={"background image for puzzle details"} />
            <div className="puzzle-details-content">
                <div className="puzzle-details">
                    <div>
                        {props.level.type === LevelItemType.PUZZLE ? <>
                            <h1>{props.level.title}</h1>
                            <h2>Level {props.level.id}</h2>
                        </> : <>
                            <h1>{props.level.storyType === StoryBeatType.MEMO ? "Memo" : "Dialogue"}</h1>
                            <h2>Story</h2>
                        </>}
                    </div>
                    <div>
                        <h3>Overview</h3>
                        <p>{props.level.description}</p>
                    </div>
                </div>
                <div className="puzzle-details-buttons">
                    <button className="primary-button" onClick={handleStartClick}>Start</button>
                    {props.level.type === LevelItemType.PUZZLE &&
                        <div className="skipped-checkbox">
                            {props.level.status === LevelStatus.COMPLETED ? (
                                <span>Completed</span>
                            ) : (
                                <label>
                                    <input
                                        type="checkbox"
                                        onChange={handleCheckboxChange}
                                        checked={isChecked}
                                        disabled={isDisabled}
                                    />
                                    Skip
                                </label>
                            )}
                        </div>}
                </div>
            </div>
        </div>
    )
}
