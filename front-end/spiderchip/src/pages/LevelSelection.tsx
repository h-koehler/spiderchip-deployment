import LevelSelectButton from "../components/LevelSelectButton.tsx"
import PuzzleDetailPopUp from "../components/LevelDetailPopUp.tsx";
import { compareLevelItems, getUniqueLevelItemKey, LevelItem, LevelItemType, LevelStatus } from "../types.ts"
import GearIcon from "../assets/images/gear-icon.svg"
import "./LevelSelection.css"
import { useEffect, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import api, { getCurrentUserId, setAuthToken } from "../services/api.ts";
import { useNavigate } from "react-router-dom";
import { getAllPuzzles } from "../components/PuzzleDefinitions.ts";
import { useHorizontalScroll } from "../utils/useHorizontalScroll.tsx";
import { getAllStoryBeats } from "../components/StoryDefinitions.ts";

type LevelStatusDict = {
    levelId: number,
    status: LevelStatus
}

export default function LevelSelection() {
    const [levelList, setLevelList] = useState<LevelItem[]>([]);
    const [selectedLevel, setLocalSelectedLevel] = useState<LevelItem | null>(null);
    const [popupContentLevel, setPopUpContentLevel] = useState<LevelItem | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const scrollRef = useHorizontalScroll<HTMLDivElement>();
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userId = getCurrentUserId();
        const originalLevels: LevelItem[] = getAllPuzzles().map((p) => {
            return { type: LevelItemType.PUZZLE, id: p.puzzle_number, title: p.title, description: p.description, status: LevelStatus.LOCKED }
        });
        const originalStories: LevelItem[] = getAllStoryBeats().map((s) => {
            return { type: LevelItemType.STORY, id: s.story_number, level: s.associated_puzzle, storyType: s.type, description: s.description, status: LevelStatus.AVAILABLE }
        });
        api.get(`/levels/all/${userId}`)
            .then((response: { data: LevelStatusDict[] }) => {
                // the data tells us each level's status
                // could be entirely empty for a new account
                response.data.forEach((stat: LevelStatusDict) => {
                    const trueLevel = originalLevels.find((tl) => tl.id === stat.levelId);
                    if (trueLevel) {
                        trueLevel.status = stat.status;
                    }
                });
            })
            .catch(() => {
                console.log("Failed to pull save data.");
            })
            .finally(() => {
                // always want to show the levels
                const originalAllItems = [...originalLevels, ...originalStories].sort(compareLevelItems);
                const lastPassedLevel = originalLevels
                    .filter((l) => l.status === LevelStatus.COMPLETED || l.status === LevelStatus.SKIPPED)
                    .map((l) => l.id)
                    .reduce((i, j) => { return i > j ? i : j }, 0);
                originalAllItems.forEach((l) => {
                    // story elements after incomplete puzzles get locked
                    if (l.type === LevelItemType.STORY) {
                        const associatedLevel = originalLevels.find((puzzle) => puzzle.id === l.level);
                        if (associatedLevel && !(associatedLevel.status === LevelStatus.SKIPPED || associatedLevel.status === LevelStatus.COMPLETED)) {
                            l.status = LevelStatus.LOCKED;
                        }
                    }
                    else if (l.type === LevelItemType.PUZZLE && l.id === lastPassedLevel + 1) {
                        l.status = LevelStatus.AVAILABLE;
                    }
                })
                setLevelList(originalAllItems);
            })
    }, []);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    const handleLevelSelect = (level: LevelItem) => {
        setPopUpContentLevel(level);
        setLocalSelectedLevel(level);
    }

    const updateLevelStatus = (level: LevelItem, newStatus: LevelStatus) => {
        setLevelList((prevLevels) => {
            const updatedLevels = prevLevels.map((l) => {
                if (l === level) {
                    const modifiedLevel = { ...l, status: newStatus };
                    setLocalSelectedLevel(modifiedLevel);
                    return modifiedLevel;
                } else if (newStatus !== LevelStatus.LOCKED) {
                    // unlock the stuff after it
                    if (l.type === LevelItemType.STORY && l.level == level.id) {
                        return { ...l, status: LevelStatus.AVAILABLE };
                    } else if (l.type === LevelItemType.PUZZLE && l.id === level.id + 1) {
                        return { ...l, status: LevelStatus.AVAILABLE };
                    } else {
                        return l;
                    }
                } else {
                    return l;
                }
            });
            const userId = getCurrentUserId();
            api.post(`/levels/all/${userId}`,
                /* Alternatively, to update all unlocked levels, pass the following:
                    updatedLevels
                        .filter((l) => l.type === LevelItemType.PUZZLE && l.status !== LevelStatus.LOCKED)
                        .map((l) => { return { levelId: l.id, status: l.status } })
                */
                [{ levelId: level.id, status: newStatus }]
            ).catch(() => {
                console.log("Failed to save level status changes.");
            });
            return updatedLevels;
        });
    };

    const handleHome = () => {
        navigate("/game");
    }

    const handleSandbox = () => {
        navigate("/puzzle/sandbox");
    }

    const handleLogOut = () => {
        setAuthToken(null);
        navigate("/");
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const popUp = document.querySelector(".puzzle-details-window");
            const dropdown = document.querySelector(".dropdown-menu")
            if (popUp && !popUp.contains(event.target as Node)) {
                setLocalSelectedLevel(null);
            }
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
        };

        if (selectedLevel || dropdownVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedLevel, dropdownVisible])

    return (
        <div className="level-selection-container">
            <div className="settings-dropdown">
                <button onClick={toggleDropdown}>
                    <img src={GearIcon} />
                </button>
                {dropdownVisible && (
                    <ul className="dropdown-menu">
                        <li><button onClick={handleHome}>Home</button></li>
                        <li><button onClick={handleSandbox}>Sandbox</button></li>
                        <li><button onClick={handleLogOut}>Log Out</button></li>
                    </ul>
                )}
            </div>
            <div className="scroll-container" ref={scrollRef}>
                <ul>
                    {levelList.map(level => (
                        <LevelSelectButton
                            key={getUniqueLevelItemKey(level)}
                            level={level}
                            isActive={level === selectedLevel}
                            onClick={handleLevelSelect}
                        />
                    ))}
                </ul>
            </div>

            <CSSTransition
                in={!!selectedLevel}
                timeout={300}
                classNames="popup-slide"
                unmountOnExit
                nodeRef={popupRef}
                onExited={() => {
                    setPopUpContentLevel(null);
                }}
            >
                <div ref={popupRef} className={"popup-slide-wrapper"}>
                    {popupContentLevel && (
                        <PuzzleDetailPopUp
                            level={popupContentLevel}
                            updateLevelStatus={updateLevelStatus}
                        />
                    )}
                </div>
            </CSSTransition>
        </div>
    )
}
