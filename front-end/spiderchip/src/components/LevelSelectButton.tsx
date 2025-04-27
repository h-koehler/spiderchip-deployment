import { LevelItem, LevelItemType, LevelStatus } from "../types";
import "./LevelSelectButton.css"
import CompletedIcon from '../assets/images/completed-icon.svg';
import SkippedIcon from '../assets/images/skipped-icon.svg';
import defaultFolder from '../assets/images/folder-default.svg';
import hoverFolder from '../assets/images/folder-hover.svg';
import activeFolder from '../assets/images/folder-active.svg';
import { useState } from "react";
import { StoryBeatType } from "./StoryDefinitions";

export default function LevelSelectButton(props: {
    level: LevelItem,
    isActive: boolean,
    onClick: (level: LevelItem) => void
}) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        if (props.level.status !== LevelStatus.LOCKED) {
            setIsHovered(true);
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    }

    const handleLevelOnClick = () => {
        props.onClick(props.level)
    }

    const renderStatusIcon = () => {
        switch (props.level.status) {
            case LevelStatus.COMPLETED:
                return <img src={CompletedIcon} />
            case LevelStatus.SKIPPED:
                return <img src={SkippedIcon} />
            default:
                return null;
        }
    }

    return (
        <li
            className="level-select-button"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={defaultFolder}
                alt={"closed folder"}
                className={`icon ${props.isActive || isHovered ? "hidden" : ""}`}
            />
            <img
                src={hoverFolder}
                alt={"open folder on hover"}
                className={`icon ${isHovered && !props.isActive ? "" : "hidden"}`}
            />
            <img
                src={activeFolder}
                alt={"active folder"}
                className={`icon ${props.isActive ? "" : "hidden"}`}
            />
            <button
                className="level-button"
                onClick={() => handleLevelOnClick()}
                disabled={props.level.status === LevelStatus.LOCKED}
            >
                {props.level.type === LevelItemType.PUZZLE ? <>
                    <h2>{props.level.title}</h2>
                    <h3>Level {props.level.id}</h3>
                </> : <>
                    <h2>{props.level.storyType === StoryBeatType.MEMO ? "Memo" : "Dialogue"}</h2>
                    <h3>Story</h3>
                </>}
                <div className="status-icon">
                    {renderStatusIcon()}
                </div>
            </button>
        </li>
    )
}
