import LevelSelectButton from "../components/LevelSelectButton.tsx"
import PuzzleDetailPopUp from "../components/PuzzleDetailPopUp.tsx";
import {LevelItem} from "../types.ts"
import GearIcon from "../assets/images/gear-icon.png"
import "./LevelSelection.css"
import {useEffect, useRef, useState} from "react";
import { CSSTransition } from "react-transition-group";
import { setAuthToken } from "../services/api.ts";
import { useNavigate } from "react-router-dom";

export default function LevelSelection(props: { setSelectedLevel: (level: LevelItem | null) => void }) {
    const [selectedLevel, setLocalSelectedLevel] = useState<LevelItem | null>(null);
    const [popupContentLevel, setPopUpContentLevel] = useState<LevelItem | null>(null);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const navigate = useNavigate();
    const popupRef = useRef<HTMLDivElement>(null);

    const [levelList, setLevelList] = useState<LevelItem[]>([
        {id: 1, title: "Level 1", category: "Category 1", description: "Description 1", status: "completed"},
        {id: 2, title: "Level 2", category: "Category 2", description: "Description 2", status: "skipped"},
        {id: 3, title: "Level 3", category: "Category 3", description: "Description 3", status: "available"},
        {id: 4, title: "Level 4", category: "Category 4", description: "Description 4", status: "not-available"},
    ]);

    // TODO: implement to retrieve list of levels instead of static list
    // useEffect(() => {
    //     const fetchLevels = async() => {
    //         try {
    //             const response = await fetch("api/users/level")
    //         }
    //     }
    // })

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible)
    }

    const handleLevelSelect = (level: LevelItem) => {
        setPopUpContentLevel(level);
        setLocalSelectedLevel(level);
        props.setSelectedLevel(level);
    }

    const updateLevelStatus = (levelId: number, newStatus: string) => {
        setLevelList(prevLevels =>
            prevLevels.map(level =>
                level.id === levelId ? {...level, status: newStatus} : level
            )
        );

        setLocalSelectedLevel(prevLevel =>
            prevLevel && prevLevel.id === levelId ? {...prevLevel, status: newStatus} : prevLevel
        )
    };

    const handleLogOut = () => {
            setAuthToken(null);
            localStorage.removeItem("token");
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
    }, [selectedLevel])

    return (
        <div className="level-selection-container">
            <div className="settings-dropdown">
                <button onClick={toggleDropdown}>
                    <img src={GearIcon}/>
                </button>
                {dropdownVisible && (
                    <ul className="dropdown-menu">
                        <li><button>Settings</button></li>
                        <li><button onClick={handleLogOut}>Log Out</button></li>
                    </ul>
                )}
            </div>
            <div className="scroll-container">
                <ul>
                    {levelList.map(level => (
                        <LevelSelectButton
                            key={level.id}
                            level={level}
                            isActive={selectedLevel?.id === level.id}
                            setSelectedLevel={handleLevelSelect}
                            updateLevelStatus={updateLevelStatus}
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
                    props.setSelectedLevel(null);
                }}
            >
                <div ref={popupRef} className={"popup-slide-wrapper"}>
                    {popupContentLevel && (
                    <PuzzleDetailPopUp
                        level={popupContentLevel}
                        setSelectedLevel={setLocalSelectedLevel}
                        updateLevelStatus={updateLevelStatus}
                    />
                        )}
                </div>
            </CSSTransition>
        </div>
    )
}