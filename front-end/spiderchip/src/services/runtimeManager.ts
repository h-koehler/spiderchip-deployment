import { SpiderRuntime, SpiderStateEnum, SpiderState, CustomSlot, SpiderError } from "../language-system/ls-interface-types";

export const runtimeRef: { current: SpiderRuntime | null } = { current: null };

export const initializeRuntime = (code: string, setParserOutput: (output: string) => void) => {
    if (!runtimeRef.current) {
        console.error("Runtime is not initialized.");
        return;
    }

    const initialVars: CustomSlot[] = [
        new CustomSlot(0, "slot0", 0),
        new CustomSlot(1, "slot1", 0),
        new CustomSlot(2, "slot2", 0),
    ];

    // Initialize runtime
    runtimeRef.current.init(code, initialVars, 0);

    // Check for syntax errors
    const linterErrors = runtimeRef.current.lint();
    if (linterErrors.length > 0) {
        const errors = linterErrors.map((error: SpiderError) => `Line ${error.line}: ${error.msg}`).join("\n");
        setParserOutput(errors);
        return;
    }

    // Fetch the current state
    const state = runtimeRef.current.state();
    if (state) updateOutput(state, setParserOutput);
};

export const updateOutput = (state: SpiderState, setParserOutput: (output: string) => void) => {
    let outputMessage = "";

    switch (state.state) {
        case SpiderStateEnum.NEW:
            outputMessage = "Code is parsed successfully, ready to run.";
            break;
        case SpiderStateEnum.INVALID:
            outputMessage = "Code failed parsing. Check your syntax.";
            break;
        case SpiderStateEnum.ERROR:
            outputMessage = `Runtime Error: ${state.error}`;
            break;
        case SpiderStateEnum.RUNNING:
            outputMessage = `Running... Currently at line ${state.line}`;
            break;
        case SpiderStateEnum.SUCCESS:
            outputMessage = "Execution Successful! All test cases passed.";
            break;
        case SpiderStateEnum.FAIL:
            outputMessage = "Execution Failed. One or more test cases failed.";
            break;
        case SpiderStateEnum.DUBIOUS:
            outputMessage = `Execution Failed for test case ${state.failedCase}.`;
            break;
        default:
            outputMessage = "Unknown state encountered.";
    }

    // Display tape slots
    state.varslots.forEach((slot, index) => {
        outputMessage += `> Tape Slot ${index}: ${slot.value} (${slot.name ?? "Unnamed"})\n`;
    });

    // Display stack/queue contents
    state.objs.forEach(obj => {
        outputMessage += `> ${obj.type} '${obj.name}' Contents: ${obj.contents.join(", ")}\n`;
    });

    setParserOutput(outputMessage.trim());
};

export const stepCode = (setParserOutput: (output: string) => void) => {
    if (!runtimeRef.current) return;

    runtimeRef.current.step();
    const state = runtimeRef.current.state();
    if (state) updateOutput(state, setParserOutput);
};

// Initialize runtime when the module is loaded (move this to where it's appropriate)
export const initializeSpiderRuntime = () => {
    if (!runtimeRef.current) {
        try {
            // runtimeRef.current = createRuntime();
        } catch (error) {
            console.error("Failed to initialize runtime:", error);
        }
    }
};
