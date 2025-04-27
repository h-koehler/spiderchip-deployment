import "./Dialogue.css";
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Dialogue = ({ children, character, entries }: { children: React.ReactNode, character: string, entries: string[] }) => {
    const [entryIndex, setEntryIndex] = useState(0);
    const entry = entries[entryIndex];

    const [content, setContent] = useState("");
    const [drawIndex, setDrawIndex] = useState(0);

    const canAdvance = entryIndex < entries.length - 1;
    const canSpeedup = drawIndex < entry.length;

    const advanceDialogue = () => {
        if (canSpeedup) {
            setDrawIndex(entry.length);
        } else if (canAdvance) {
            setEntryIndex(entryIndex + 1);
            setDrawIndex(0);
        }
    }

    const msPerDraw = 10;
    const charsPerDraw = 1;
    useEffect(() => {
        const anim = setInterval(() => {
            setDrawIndex((i) => {
                if (i > entry.length) {
                    clearInterval(anim);
                    return i;
                }
                return i + charsPerDraw;
            });
        }, msPerDraw);

        return () => {
            clearInterval(anim);
        }
    }, [entry.length]);

    useEffect(() => {
        setContent(entry.slice(0, drawIndex));
    }, [entry, drawIndex]);

    return (
        <div className="dialogue-page">
            <div className="dialogue-container">
                <p className="dialogue-speaker">{character}</p>
                <div className={"dialogue-content" + (canAdvance || canSpeedup ? " dialogue-clickable" : "")}
                    onClick={advanceDialogue}>
                    <p>{content}</p>
                    {(canAdvance || canSpeedup) && <FontAwesomeIcon className="dialogue-next-icon" icon={faCaretDown} />}
                </div>
                {children}
            </div>
        </div>
    )
};

export default Dialogue;
