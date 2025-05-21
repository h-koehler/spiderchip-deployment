import {LevelItem, LevelItemType, LevelStatus, LineHighlight, LineHighlightType} from "../types.ts";
import PuzzleVisualization from "../components/PuzzleVisualization.tsx";
import PuzzleInput from "../components/PuzzleInput.tsx";
import PuzzleOutput from "../components/PuzzleOutput.tsx";
import PuzzleDetails from "../components/PuzzleDetails.tsx";
import PuzzleSandboxControls from "../components/PuzzleSandboxControls.tsx";
import "./PuzzleUI.css"
import { useEffect, useState, useRef, useCallback, ChangeEvent } from "react";
import PuzzlePauseMenu from "../components/PuzzlePauseMenu.tsx";
import InputIcon from "../assets/images/input-icon.svg";
import DetailsIcon from "../assets/images/details-icon.svg";
import VizIcon from "../assets/images/visualization-icon.svg";
import OutputIcon from "../assets/images/output-icon.svg";
import MenuIcon from "../assets/images/pause-button-icon.svg";
import PlayIcon from "../assets/images/play-button-icon.svg";
import StepIcon from "../assets/images/step-button-icon.svg";
import HintIcon from "../assets/images/hint-button-icon.svg";
import ResetIcon from "../assets/images/reset-button-icon.svg";
import createRuntime from "../language-system/ls-system.ts";
import * as LT from "../language-system/ls-interface-types.ts";
import { useNavigate, useParams } from "react-router-dom";
import { getPuzzleDefinition } from "../components/PuzzleDefinitions.ts";
import DebugPuzzleVisualization from "../components/DebugPuzzleVisualization.tsx";
// import api, { getCurrentUserId } from "../services/api.ts";

type LevelInfo = {
    id: string | number;
    title: string;
    description: string;
}

const LEVEL_LIST_KEY = "user_level_progress";
const PUZZLE_KEY = (id: string | undefined) => `user_puzzle_${id}`;

function markLevelComplete(puzzleId: number) {
    const raw = localStorage.getItem(LEVEL_LIST_KEY);
    if (!raw) return;
    const levels: LevelItem[] = JSON.parse(raw);

    const updated = levels.map(l => {
        if (l.type === LevelItemType.PUZZLE && l.id === puzzleId) {
            return { ...l, status: LevelStatus.COMPLETED};
        }
        return l;
    });

    console.log("🚀 [PuzzleUI] writing updated levels:", updated);
    localStorage.setItem(LEVEL_LIST_KEY, JSON.stringify(updated))
}

const emptyLevel: LevelInfo = { id: "unknown", title: "Unknown", description: "Something went wrong when loading the puzzle." };
const emptyPuzzle = new LT.Puzzle(0, [new LT.PuzzleTest([], null, [], [])]);
const sandboxLevel: LevelInfo = { id: "sandbox", title: "Sandbox", description: "Create your own puzzle and experiment with the code!" };

export default function PuzzleUI() {
    const { puzzleId } = useParams();
    const navigate = useNavigate();

    // const userId = useRef<string | undefined>(getCurrentUserId());
    const puzzleStatus = useRef<LevelStatus>(LevelStatus.AVAILABLE);
    const [showSuccess, setShowSuccess] = useState(false);

    const [loading, setLoading] = useState(true);
    const [level, setLevel] = useState<LevelInfo>(emptyLevel);

    const [hints, setHints] = useState<string[]>([]);
    const [showHints, setShowHints] = useState(false);
    const [currentHint, setCurrentHint] = useState(0);

    const runtime = useRef<LT.SpiderRuntime>(createRuntime(emptyPuzzle));
    const [rtState, setRtState] = useState<LT.SpiderState | null>(null);
    const [anims, setAnims] = useState<LT.SpiderAnimation[]>([]);
    const caseNum = useRef<number>(0);

    const [output, setOutput] = useState<string>("");
    const [highlightedLines, setHighlightedLines] = useState<LineHighlight[] | undefined>(undefined);

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [bigDetails, setBigDetails] = useState(false);
    const [debugVis, setDebugVis] = useState(false);
    const [animSpeed, setAnimSpeed] = useState(2);

    const [code, setCode] = useState<string>("");
    const savedCode = useRef<string>("");
    const [initialVars, setInitialVars] = useState<LT.CustomSlot[]>([]);


    useEffect(() => {
        const handleKeypress = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                toggleMenu();
            }
        }
        document.addEventListener("keydown", handleKeypress);
        return () => document.removeEventListener("keydown", handleKeypress);
    }, []);

    useEffect(() => {
        // NOTE: ensure all paths setLoading to false once they're done!
        setLoading(true);

        if (puzzleId === "sandbox") {
            setLevel(sandboxLevel);
            setHints(["Sandbox puzzles do not have hints."]);
            setLoading(false);
        } else {
            const puzzleDefinition = getPuzzleDefinition(Number.parseInt(puzzleId ?? "-1"));
            if (puzzleDefinition) {
                const puzzleData = puzzleDefinition.data;
                const puzzle = new LT.Puzzle(
                    puzzleData.slot_count,
                    puzzleData.test_cases.map((t) =>
                        new LT.PuzzleTest(
                            Object.keys(puzzleData.objects).map((o) =>
                                new LT.SpiderObject(puzzleData.objects[o], o, t?.[o] ?? [])
                            ),
                            t.slots ?? null,
                            t.input,
                            t.output,
                            t.target ?? null
                        )
                    ),
                    puzzleData.slot_names ?? null,
                    puzzleData.test_cases[0].slots || puzzleData.test_cases[0].target ? false : true, // if test cases are defining slot details, no editing
                    puzzleData.can_rename ?? true,
                )
                const level: LevelInfo = {
                    id: puzzleId ?? "unknown",
                    title: puzzleDefinition.title,
                    description: puzzleData.overview
                }
                setLevel(level);
                setHints(puzzleData.hints);
                const vars = puzzle.defaultSlotNames?.map(
                    (name, i) => new LT.CustomSlot(i, name ?? undefined, 0)
                ) ?? [];
                setInitialVars(vars);

                const chosenCase = Math.floor(Math.random() * puzzle.testCases.length);
                caseNum.current = chosenCase;
                runtime.current = createRuntime(puzzle);

                const saved = localStorage.getItem(PUZZLE_KEY(puzzleId))
                if (saved) {
                    const { code: savedCodeString, status: savedStatus } = JSON.parse(saved);
                    runtime.current.init(savedCodeString, vars, chosenCase);
                    setCode(savedCodeString);
                    savedCode.current = savedCodeString; // savedCodeRef.current = savedCode
                    puzzleStatus.current = savedStatus;
                } else {
                    runtime.current.init("", vars, chosenCase);
                }

                setRtState(runtime.current.state());
                setLoading(false);

            } else {
                console.log("Could not find puzzle.");
                setLoading(false);
            }
        }
    }, [puzzleId]);

    const saveProgress = useCallback(() => {
        // don't save anything in the sandbox
        if (puzzleId !== "sandbox") {
            // if we know we haven't saved this, then save it
            if (code !== savedCode.current) {
                const payload = { code, status: puzzleStatus.current };
                localStorage.setItem(PUZZLE_KEY(puzzleId), JSON.stringify(payload));
            }
            // they re-beat the level with the same code
            if (puzzleStatus.current === LevelStatus.COMPLETED) {
                setShowSuccess(true);
            }
        }
        savedCode.current = code;
    }, [puzzleId, code]);

    useEffect(() => {
        // the hail-mary save
        window.addEventListener("beforeunload", saveProgress);
        return () => {
            window.removeEventListener("beforeunload", saveProgress);
        };
    }, [saveProgress]);

    const updateSandboxPuzzle = (puzzle: LT.Puzzle) => {
        runtime.current = createRuntime(puzzle);
        const vars = puzzle.defaultSlotNames?.map(
            (name, i) => new LT.CustomSlot(i, name ?? undefined, 0)
        ) ?? [];
        setInitialVars(vars);
        caseNum.current = 0;

        // now go update the visuals
        resetCode();
    }

    const toggleMenu = () => {
        setMenuIsOpen(prev => !prev);
    };

    const menuClickedQuit = () => {
        saveProgress();
        navigate("/level-select");
    }

    /**
     * Update the linting, with a full update also highlighting illegal lines.
     * Setting force to true will always update, even if there are no linter errors.
     * Returns true if an update occurred.
     */
    const updateLinting = (full: boolean = false, force: boolean = false): boolean => {
        const lint = runtime.current.lint();
        if (lint.length > 0 || force) {
            setOutput(lint.map((err) => lintString(err)).join("\n"));
            if (full) {
                setHighlightedLines(runtime.current.lint().map((err) => { return { line: err.line, type: LineHighlightType.WARNING } }))
            }
            return true;
        }
        return false;
    }

    const editCode = (newCode: string) => {
        setCode(newCode);

        // parse whatever they just changed the code to
        runtime.current.init(newCode, initialVars, caseNum.current);
        const state = rtState ?? runtime.current.state();

        // check the PREVIOUS state - if it's already new, we shouldn't need to re-render
        // this prevents spamming visualizer updates while just writing code
        if (state.state !== LT.SpiderStateEnum.NEW && state.state !== LT.SpiderStateEnum.INVALID) {
            setRtState(runtime.current.state());
            setAnims([]);
        }

        // reset all highlights since they're editing code now
        setHighlightedLines(undefined);

        // keep the live linter output up to date (not error highlights, though)
        updateLinting(false, true);
    }

    const runCode = () => {
        try {
            // no need to spam state changes while doing this, so we can speed to end without rendering
            runtime.current.step();
            while (runtime.current.state().state === LT.SpiderStateEnum.RUNNING) {
                runtime.current.step();
            }
            // now render it
            updateCodeState();
        } catch (e) {
            console.log("Problem running:", e);
        }
    }

    const stepCode = () => {
        try {
            // we explicitly re-check instead of going through RtState because it may be out of date from code editing
            const state = runtime.current.state();
            if (state.state === LT.SpiderStateEnum.NEW || state.state === LT.SpiderStateEnum.RUNNING) {
                // this function would have no effect, but we don't want to cause irrelevant visual re-updates
                runtime.current.step();
                updateCodeState();
            }
        } catch (e) {
            console.log("Problem stepping:", e);
        }
    }

    const updateCodeState = () => {
        if (updateLinting(true)) {
            // you have errors, show that instead
            return;
        }

        const newState = runtime.current.state();
        setRtState(newState);
        setAnims(runtime.current.anim());

        const codeOutputs = newState.output.join("\n");
        let additionalMessage = null;
        let highlightType = LineHighlightType.INFO;
        switch (newState.state) {
            case LT.SpiderStateEnum.FAIL:
                highlightType = LineHighlightType.WARNING;
                additionalMessage = "Test failed.";
                saveProgress();
                break;
            case LT.SpiderStateEnum.ERROR:
                highlightType = LineHighlightType.WARNING;
                additionalMessage = "Code crashed.";
                saveProgress();
                break;
            case LT.SpiderStateEnum.SUCCESS:
                highlightType = LineHighlightType.SUCCESS;
                additionalMessage = "Puzzle completed!";
                puzzleStatus.current = LevelStatus.COMPLETED;
                markLevelComplete(Number(puzzleId));
                saveProgress();
                break;
            case LT.SpiderStateEnum.DUBIOUS:
                highlightType = LineHighlightType.DEBUG;
                additionalMessage = "Test case passed, but another failed. Rerun your code.";
                caseNum.current = newState.failedCase ?? 0;
                saveProgress();
                break;
        }
        setHighlightedLines([{ line: newState.line, type: highlightType }]);
        setOutput([codeOutputs, newState.error, additionalMessage].filter((x) => x).join("\n"));
    }

    const resetCode = () => {
        runtime.current.init(code, initialVars, caseNum.current);
        setRtState(runtime.current.state());
        setOutput("");
        setHighlightedLines(undefined);
        setAnims([]);
        updateLinting();
        setShowSuccess(false); // so they can redo in peace
    }

    const lintString = (err: LT.SpiderError): string => {
        return `Line ${err.line}: ${err.msg}`;
    }

    const changeAnimationSpeed = (e: ChangeEvent<HTMLInputElement>) => {
        const value = Number.parseInt(e.target.value);
        if (value < 1) {
            setAnimSpeed(1);
        } else if (value > 3) {
            setAnimSpeed(3);
        } else {
            setAnimSpeed(value);
        }
    }

    if (loading) {
        return (
            <div className="puzzle-loading">
                <h3>Puzzle loading. Please wait.</h3>
            </div>
        )
    }

    return (
        <div className="puzzle-layout">
            <div className="input-container">
                <div className="header">
                    <img src={InputIcon} alt="Input Icon" />
                </div>
                <PuzzleInput initialValue={code} onChange={editCode} lineHighlights={highlightedLines} />
                <div className="puzzle-messsages">
                    {showSuccess &&
                        <div className="puzzle-messages-container success-container">
                            <div className="puzzle-message">
                                <p className="text">Success! You have completed this puzzle!</p>
                            </div>
                            <div className="spacing"></div>
                            <button className="primary-button" onClick={() => menuClickedQuit()}>Return to Level Select</button>
                        </div>
                    }
                    {showHints &&
                        <div className="puzzle-messages-container hint-container">
                            <div className="puzzle-message">
                                <p className="title">Hint {currentHint + 1}</p>
                                <p className="text">{hints[currentHint]}</p>
                            </div>
                            <div className="spacing"></div>
                            <button className="hint-cycle-button prev-hint" onClick={() => setCurrentHint(currentHint - 1)} disabled={currentHint <= 0}>
                                <img src={PlayIcon} />
                            </button>
                            <button className="hint-cycle-button next-hint" onClick={() => setCurrentHint(currentHint + 1)} disabled={currentHint >= hints.length - 1}>
                                <img src={PlayIcon} />
                            </button>
                        </div>
                    }
                </div>
                <div className="action-buttons">
                    <button className="menu-button" onClick={toggleMenu}>
                        <img src={MenuIcon} />
                        Menu
                    </button>
                    <button className="run-button" onClick={runCode}>
                        <img src={PlayIcon} />
                        Run
                    </button>
                    <button className="step-button" onClick={stepCode}>
                        <img src={StepIcon} />
                        Step
                    </button>
                    <button className="hint-button" onClick={() => setShowHints(!showHints)}>
                        <img src={HintIcon} />
                        Hint
                    </button>
                    <button className="reset-button" onClick={resetCode}>
                        <img src={ResetIcon} />
                        Reset
                    </button>
                </div>
            </div>
            <div className="visualization-container">
                <div className="header">
                    <img src={VizIcon} />
                    <button className="primary-button small-button"
                        onClick={() => setDebugVis(!debugVis)}>
                        {debugVis ? "Use Animated View" : "Use Clean View"}
                    </button>
                    {!debugVis && <>
                        <p>Animation Speed:</p>
                        <input type="number" value={animSpeed} onChange={(e) => changeAnimationSpeed(e)} />
                    </>}
                </div>
                {rtState && !debugVis && <PuzzleVisualization state={rtState} animations={anims} animationSpeedScale={animSpeed} />}
                {rtState && debugVis && <DebugPuzzleVisualization state={rtState} />}
            </div>
            <div className="output-container">
                <div className="header">
                    <img src={OutputIcon} />
                </div>
                <PuzzleOutput output={output} />
            </div>
            <div className="details-container">
                <div className="header">
                    <img src={DetailsIcon} />
                    <h2>{level.title}</h2>
                    <button className="primary-button small-button"
                        onClick={() => setBigDetails(!bigDetails)}>
                        {bigDetails ? "Shrink" : "Enlarge"}
                    </button>
                </div>
                {puzzleId === "sandbox" ?
                    <PuzzleSandboxControls extraClass={bigDetails ? "big-details" : ""} onApply={updateSandboxPuzzle} /> :
                    <PuzzleDetails extraClass={bigDetails ? "big-details" : ""} description={level.description} />}
            </div>

            {menuIsOpen && <PuzzlePauseMenu onResume={() => toggleMenu()} onQuit={() => menuClickedQuit()} />}
        </div>
    )
}
