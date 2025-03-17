import LevelSelectButton from "../components/LevelSelectButton.tsx"
import { LevelItem } from "../types.ts"

export default function LevelSelection() {

    // const [levelList, setLevelList] = useState([]);

    const levelList: LevelItem[] = [
        { id: 1, title: "Level 1", category: "Category 1", description: "Description 1", status: "completed"},
        { id: 2, title: "Level 2", category: "Category 2", description: "Description 2", status: "skipped"},
        { id: 3, title: "Level 3", category: "Category 3", description: "Description 3", status: "available"},
        { id: 4, title: "Level 4", category: "Category 4", description: "Description 4", status: "not-available"},
    ]

    const levelButtons = levelList.map((level) => (
        <LevelSelectButton level={level} />
    ));

    return (
        <div>
            <h2>Level Selection</h2>
            <ul>{levelButtons}</ul>
        </div>
    )
}