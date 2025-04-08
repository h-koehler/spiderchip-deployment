import LevelSelectButton from "../components/LevelSelectButton.tsx"
import PuzzleDetailPopUp from "../components/PuzzleDetailPopUp.tsx";
import {LevelItem} from "../types.ts"
import GearIcon from "../assets/images/gear-icon.png"
import "./LevelSelection.css"
import {useEffect, useState} from "react";

export default function LevelSelection(props: { setSelectedLevel: (level: LevelItem | null) => void }) {
    const [selectedLevel, setLocalSelectedLevel] = useState<LevelItem | null>(null)

    const [levelList, setLevelList] = useState<LevelItem[]>([
        { id: 1, title: "Level 1", category: "Category 1", description: "Description 1", status: "completed" },
        { id: 2, title: "Level 2", category: "Category 2", description: "Description 2", status: "skipped" },
        { id: 3, title: "Level 3", category: "Category 3", description: "Description 3", status: "available" },
        { id: 4, title: "Level 4", category: "Category 4", description: "Description 4", status: "not-available" },
    ]);

    // TODO: implement to retrieve list of levels instead of static list
    // useEffect(() => {
    //     const fetchLevels = async() => {
    //         try {
    //             const response = await fetch("api/users/level")
    //         }
    //     }
    // })

    const updateLevelStatus = (levelId: number, newStatus: string) => {
        setLevelList( prevLevels =>
            prevLevels.map(level =>
                level.id === levelId ? {...level, status: newStatus} : level
            )
        );

        setLocalSelectedLevel(prevLevel =>
            prevLevel && prevLevel.id === levelId ? {...prevLevel, status: newStatus} : prevLevel
        )
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const popUp = document.querySelector(".puzzle-details-window");
            if (popUp && !popUp.contains(event.target as Node)) {
                setLocalSelectedLevel(null);
            }
        };

        if (selectedLevel) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [selectedLevel])

    return (
        <div className="level-selection-container">
            <div className="settings-dropdown">
                <button>
                    <img src={GearIcon}/>
                </button>
            </div>
            <div className="scroll-container">
                <ul>
                    {levelList.map(level => (
                        <LevelSelectButton
                            key={level.id}
                            level={level}
                            setSelectedLevel={setLocalSelectedLevel}
                            updateLevelStatus={updateLevelStatus}
                        />
                    ))}
                </ul>
            </div>

            {selectedLevel && (
                <PuzzleDetailPopUp
                    level={selectedLevel}
                    setSelectedLevel={props.setSelectedLevel}
                    updateLevelStatus={updateLevelStatus}
                />
            )}
        </div>
    )
}