import { LevelItem } from "../types.ts";
import PuzzleVisualization from "../components/PuzzleVisualization.tsx";
import PuzzleInput from "../components/PuzzleInput.tsx";
import PuzzleOutput from "../components/PuzzleOutput.tsx";
import PuzzleDetails from "../components/PuzzleDetails.tsx";
import "./PuzzleUI.css"
import { useEffect, useState } from "react";
import PuzzlePauseMenu from "../components/PuzzlePauseMenu.tsx";
// import api from "../services/api.ts";
import { initializeRuntime, stepCode } from "../services/runtimeManager.ts";

export default function PuzzleUI(props: { level: LevelItem }) {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [code, setCode] = useState<string>("");4
    const [parserOutput, setParserOutput] = useState<string>("");

    // useEffect(() => {
    //     initializeSpiderRuntime();
    // }, []);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setMenuIsOpen(prev => !prev);
            }
        };

        document.addEventListener("keydown", handleEscKey);
        return () => document.removeEventListener("keydown", handleEscKey);
    }, []);

    useEffect(() => {
        const fetchInitialValue = async () => {
            try {
                // Mock API response
                const mockResponse = {
                    initialValue: `SPDR PROGRAM\n.data\ntapelength 3\n0 0\n1 0\nstack mystack\n.text\nstart:\nmystack.push(10)`
                };
                
                // Uncomment this when backend is ready
                // const response = await api.get(`/levels/${props.level.id}`);
                
                setCode(mockResponse.initialValue);
            } catch (error) {
                console.error("Failed to fetch initial value:", error);
            }
        };

        fetchInitialValue();
    }, [props.level.id]);

    // TODO: Implement saving as player makes changes
    // TODO: Fix issue where "skipped" status on LevelSelect isn't saved when returning to page

    return (
        <div className="puzzle-layout">
            <div className="input-container">
                <PuzzleInput initialValue={code} onChange={setCode}/>
                <button className="button button-format" onClick={() => initializeRuntime(code, setParserOutput)}>Run Code</button>
                <button className="button button-format" onClick={() => stepCode(setParserOutput)}>Step</button>
            </div>
            <div className="visualization-container">
                <PuzzleVisualization/>
            </div>
            {/*TODO: Implement buttons*/}
            <div className="output-container">
                <PuzzleOutput output={parserOutput} />
            </div>
            <div className="details-container">
                <PuzzleDetails level={props.level}/>
            </div>

            {menuIsOpen && <PuzzlePauseMenu setMenuIsOpen={setMenuIsOpen} />}
        </div>
    )
}