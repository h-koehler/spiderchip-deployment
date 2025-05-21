import LevelSelectButton from "../components/LevelSelectButton.tsx"
import LevelDetailPopUp from "../components/LevelDetailPopUp.tsx";
import {compareLevelItems, getUniqueLevelItemKey, LevelItem, LevelItemType, LevelStatus} from "../types.ts"
import GearIcon from "../assets/images/gear-icon.svg"
import "./LevelSelection.css"
import {useEffect, useRef, useState} from "react";
import {CSSTransition} from "react-transition-group";
// import api, {getCurrentUserId, setAuthToken} from "../services/api.ts";
import {getAllPuzzles} from "../components/PuzzleDefinitions.ts";
import {useHorizontalScroll} from "../utils/useHorizontalScroll.tsx";
import {getAllStoryBeats} from "../components/StoryDefinitions.ts";
import {useNavigate} from "react-router-dom";
import ResetDialog from "../components/ResetDialog.tsx";

// type LevelStatusDict = {
//     levelId: number,
//     status: LevelStatus
// }

const LEVEL_LIST_KEY = "user_level_progress";

export default function LevelSelection() {
    const [levelList, setLevelList] = useState<LevelItem[]>([]);
    const [selectedLevel, setLocalSelectedLevel] = useState<LevelItem | null>(null);
    const [popupContentLevel, setPopUpContentLevel] = useState<LevelItem | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [resetMenuOpen, setResetMenuOpen] = useState(false);
    const navigate = useNavigate();
    const scrollRef = useHorizontalScroll<HTMLDivElement>();
    const popupRef = useRef<HTMLDivElement>(null);

    function loadLevels(): LevelItem[] {
        const originalLevels: LevelItem[] = getAllPuzzles().map((p) => {
            return {
                type: LevelItemType.PUZZLE,
                id: p.puzzle_number,
                title: p.title,
                description: p.description,
                status: LevelStatus.LOCKED
            }
        });
        const originalStories: LevelItem[] = getAllStoryBeats().map((s) => {
            return {
                type: LevelItemType.STORY,
                id: s.story_number,
                level: s.associated_puzzle,
                storyType: s.type,
                description: s.description,
                status: LevelStatus.AVAILABLE
            }
        });

        let originalAllItems = [...originalLevels, ...originalStories].sort(compareLevelItems);

        const saved = localStorage.getItem(LEVEL_LIST_KEY);
        if (!saved) {
            localStorage.setItem(LEVEL_LIST_KEY, JSON.stringify(originalAllItems));
            return originalAllItems;
        }

        const savedList = JSON.parse(saved) as LevelItem[];
        const savedMap = new Map<string, LevelStatus>(savedList.map(l => [getUniqueLevelItemKey(l), l.status]))

        originalAllItems = originalAllItems.map(item => ({
            ...item,
            status: savedMap.get(getUniqueLevelItemKey(item)) ?? item.status
        }))

        const lastPassedLevel = originalAllItems
            .filter((l) => l.type === LevelItemType.PUZZLE && (l.status === LevelStatus.COMPLETED || l.status === LevelStatus.SKIPPED))
            .map((l) => l.id)
            .reduce((i, j) => { return i > j ? i : j }, 0);

        originalAllItems = originalAllItems.map(l => {
            if (l.type === LevelItemType.STORY) {
                const parent = originalAllItems.find(p => p.type === LevelItemType.PUZZLE && p.id === l.level);
                if (parent && (parent.status === LevelStatus.COMPLETED || parent.status === LevelStatus.SKIPPED)) {
                    return { ...l, status: LevelStatus.AVAILABLE };
                } else if (!parent) {
                    return { ...l, status: LevelStatus.AVAILABLE };
                } else {
                    return { ...l, status: LevelStatus.LOCKED };
                }
            } else if (l.type === LevelItemType.PUZZLE && l.id === lastPassedLevel + 1) {
                return { ...l, status: LevelStatus.AVAILABLE };
            }
            return l;
        });

        localStorage.setItem(LEVEL_LIST_KEY, JSON.stringify(originalAllItems));
        return originalAllItems;
    }

    useEffect(() => {
        setLevelList(loadLevels());
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
                    const modifiedLevel = {...l, status: newStatus};
                    setLocalSelectedLevel(modifiedLevel);
                    return modifiedLevel;
                } else if (newStatus !== LevelStatus.LOCKED) {
                    // unlock the stuff after it
                    if (l.type === LevelItemType.STORY && l.level == level.id) {
                        return {...l, status: LevelStatus.AVAILABLE};
                    } else if (l.type === LevelItemType.PUZZLE && l.status === LevelStatus.LOCKED && l.id === level.id + 1) {
                        return {...l, status: LevelStatus.AVAILABLE};
                    } else {
                        return l;
                    }
                } else {
                    return l;
                }
            });

            localStorage.setItem(LEVEL_LIST_KEY, JSON.stringify(updatedLevels));
            return updatedLevels;
        });
    };

    const handleHome = () => {
        navigate("/game");
    }

    const handleSandbox = () => {
        navigate("/puzzle/sandbox");
    }

    const handleReset = () => {
        localStorage.clear();
        navigate("/");
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const popUp = document.querySelector(".puzzle-details-window");
            const dropdown = document.querySelector(".dropdown-menu")
            const resetDialog = document.querySelector(".reset-menu")
            if (popUp && !popUp.contains(event.target as Node)) {
                setLocalSelectedLevel(null);
            }
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setDropdownVisible(false);
            }
            if (resetDialog && !resetDialog.contains(event.target as Node)) {
                setResetMenuOpen(false);
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
                    <img src={GearIcon}/>
                </button>
                {dropdownVisible && (
                    <ul className="dropdown-menu">
                        <li>
                            <button onClick={handleHome}>Home</button>
                        </li>
                        <li>
                            <button onClick={handleSandbox}>Sandbox</button>
                        </li>
                        <li>
                            <button onClick={() => setResetMenuOpen(true)}>Reset Progress</button>
                        </li>
                    </ul>
                )}
            </div>
            <div className="scroll-container" ref={scrollRef}>
                {levelList.length === 0 && <h3 className="level-list-loading-text">Loading...</h3>}
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
                        <LevelDetailPopUp
                            level={popupContentLevel}
                            updateLevelStatus={updateLevelStatus}
                        />
                    )}
                </div>
            </CSSTransition>

            {resetMenuOpen &&
                <ResetDialog
                    onYes={() => handleReset()}
                    onNo={() => setResetMenuOpen(false)}
                />
            }
        </div>
    )
}
