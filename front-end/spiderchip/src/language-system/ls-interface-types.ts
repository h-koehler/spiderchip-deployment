export class Puzzle {
    slotCount: number; // number of varslots present
    testCases: PuzzleTest[]; // test cases for this puzzle
    defaultSlotNames: (string | null | undefined)[] | null; // (null default) default slot names to use, `slotCount` long, undefined/null if no name for that slot
    canEditSlots: boolean; // (false default) whether or not this puzzle allows editing initial slot values
    canRenameSlots: boolean; // (true default) whether or not this puzzle allows renaming slots

    constructor(slotCount: number,
        testCases: PuzzleTest[],
        defaultSlotNames: (string | null | undefined)[] | null = null,
        canEditSlots: boolean = false,
        canRenameSlots: boolean = true) {
        this.slotCount = slotCount;
        this.testCases = testCases;
        this.defaultSlotNames = defaultSlotNames;
        this.canEditSlots = canEditSlots;
        this.canRenameSlots = canRenameSlots;
    }
}

export class PuzzleTest {
    objects: SpiderObject[];
    slotValues: number[] | null; // `slotCount` long, null = "all zeroes", ignored (= assumed null) if `canEditSlots` is true
    inputQueue: number[];
    expectedOutput: number[];
    expectedSlots: number[] | null; // up to `slotCount` long (however many to check), null = "don't care" (only look at expectedOutput)

    constructor(objects: SpiderObject[],
        slotValues: number[] | null,
        inputQueue: number[],
        expectedOutput: number[],
        expectedSlots: number[] | null = null) {
        this.objects = objects;
        this.slotValues = slotValues;
        this.inputQueue = inputQueue;
        this.expectedOutput = expectedOutput;
        this.expectedSlots = expectedSlots;
    }
}

export class CustomSlot {
    slot: number;
    name: string | undefined;
    value: number | undefined;

    constructor(slot: number, name: string | undefined = undefined, value: number | undefined = undefined) {
        this.slot = slot;
        this.name = name;
        this.value = value;
    }

    toProgramText(): string {
        return `${this.slot} ${this.name ?? ""} ${this.value ?? ""}`;
    }
}

export interface SpiderRuntime {
    /**
     * Re-initialize a runtime entry, giving it whatever the new player text is and variables.
     * It is a good idea to debounce code changes rather than spamming init for each keypress.
     * Do not randomly change the caseNum per init, instead keep using one until solved or dubious.
     *
     * When initializing a puzzle, create the runtime and IMMEDIATELY call this `init` function.
     * This will initialize the full runtime and allow usage of the other functions.
     */
    init(text: string, variables: CustomSlot[], caseNum: number): undefined;

    /**
     * Obtain linter errors from parse result. Empty array if no errors.
     */
    lint(): SpiderError[];

    /**
     * Obtain the true line count for the code entered (so, excluding comment-only or empty lines).
     */
    lineCount(): number;

    /**
     * Obtain the current state of the runtime environment.
     */
    state(): SpiderState;

    /**
     * Obtain animation data for the last state change.
     */
    anim(): SpiderAnimation[];

    /**
     * Step through one line for the runtime environment. See `state()` for new status.
     * No effect if linter errors are present or the runtime has halted.
     */
    step(): undefined;
}

export class SpiderError {
    line: number;
    msg: string;

    constructor(line: number, msg: string) {
        this.line = line;
        this.msg = msg;
    }
}


export class SpiderState {
    state: SpiderStateEnum; // current parser state, see explanations of each on the enum
    varslots: SpiderSlot[]; // current state of all variable slots
    objs: SpiderObject[]; // current state of all objects
    input: number[]; // input not yet consumed
    output: number[]; // cumulative output that has been sent
    line: number; // line number that was executed by the last call to step
    error: string | undefined; // if state is error, the error message
    failedCase: number | undefined; // if state is dubious, a failing case id

    constructor(state: SpiderStateEnum, varslots: SpiderSlot[], objs: SpiderObject[], input: number[], output: number[],
        line: number, error: string | undefined = undefined, failedCase: number | undefined = undefined) {
        this.state = state;
        this.varslots = varslots;
        this.objs = objs;
        this.input = input;
        this.output = output;
        this.line = line;
        this.error = error;
        this.failedCase = failedCase;
    }
}

export enum SpiderStateEnum {
    NEW,     // code is not yet running, but has passed parsing
    INVALID, // code failed parsing - see linter for errors
    ERROR,   // execution error - see `error` entry for details
    RUNNING, // currently running test case
    SUCCESS, // all test cases succeeded - puzzle passed!
    FAIL,    // test case failed
    DUBIOUS, // test case passed, but another failed - `case` entry has id of a failing case (puzzle NOT passed)
}

export class SpiderSlot {
    value: number;
    name: string;

    constructor(value: number, name: string) {
        this.value = value;
        this.name = name;
    }
}

export class SpiderObject {
    type: string;
    name: string;
    contents: number[];

    constructor(type: string, name: string, contents: number[]) {
        this.type = type;
        this.name = name;
        this.contents = contents;
    }

    toProgramText(): string {
        return `${this.type} ${this.name} ${this.contents.join(" ")}`;
    }
}

export class SpiderAnimation {
    // TODO: Not implemented. Not targeted for MVP.
}
