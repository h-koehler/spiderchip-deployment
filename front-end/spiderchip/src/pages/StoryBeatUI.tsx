import { useNavigate, useParams } from "react-router-dom";
import Memo from "../components/Memo";
import "./StoryBeatUI.css";
import LiurenIcon from "../assets/images/liuren.svg";
import { getSpecificStoryBeat, StoryBeatType } from "../components/StoryDefinitions";
import React from "react";
import Dialogue from "../components/Dialogue";

export default function StoryBeatUI() {
    const { storyId } = useParams();
    const story = getSpecificStoryBeat(Number.parseInt(storyId ?? "-1"));
    const navigate = useNavigate();

    if (story?.type === StoryBeatType.MEMO) {
        return (
            <Memo>
                {story.department ? <div className="story-letterhead">
                    <img src={LiurenIcon} />
                    <div className="story-letterhead-info">
                        <h1>Liuren Republic</h1>
                        <h3>{story.department}</h3>
                    </div>
                </div>
                    : <img className="story-no-letterhead-icon" src={LiurenIcon} />}
                {/* Break paragraphs on doubles, and break lines on singles */}
                {story.text.split("\n\n").map((paragraph, i) => <p key={i}>{
                    paragraph.split("\n").map((line, io) =>
                        <React.Fragment key={io}>{line}<br /></React.Fragment>
                    )
                }</p>)}
                <div className="story-spacer" />
                <button className="primary-button" onClick={() => navigate('/level-select')} >
                    Go Back
                </button>
            </Memo>
        )
    } else if (story?.type === StoryBeatType.DIALOGUE) {
        return (
            <Dialogue character={story.character} entries={story.entries}>
                <button className="primary-button" onClick={() => navigate('/level-select')} >
                    Go Back
                </button>
            </Dialogue>
        )
    } else {
        return (
            <Memo>
                <p>Unknown story beat.</p>
                <button className="primary-button" onClick={() => navigate('/level-select')} >
                    Go Back
                </button>
            </Memo>
        )
    }
}
