import * as LT from "./ls-interface-types";
import { ExecutionEngine } from "./internal/engine";

export default createRuntime;

/**
 * Create an instance of a SpiderRuntime for the given puzzle.
 * Immediately call `.init(...)` on the returned runtime to complete initialization.
 */
function createRuntime(puzzle: LT.Puzzle): LT.SpiderRuntime {
    return new Runtime(puzzle);
}

class Runtime implements LT.SpiderRuntime {
    puzzle: LT.Puzzle;
    programText: string = "";
    customVariables: LT.CustomSlot[] = [];
    caseNum: number = 0;
    failedCase: number | undefined = undefined;
    primaryEngine: ExecutionEngine | undefined = undefined;

    constructor(puzzle: LT.Puzzle) {
        this.puzzle = puzzle;
    }

    init(text: string, variables: LT.CustomSlot[], caseNum: number): undefined {
        this.programText = text;
        this.customVariables = variables.map((s) => new LT.CustomSlot(s.slot, s.name, s.value)); // get our own!
        this.caseNum = caseNum;
        this.failedCase = undefined;
        this.primaryEngine = new ExecutionEngine(this.puzzle, this.puzzle.testCases[caseNum], text, this.customVariables);
    }

    lint(): LT.SpiderError[] {
        if (!this.primaryEngine) {
            throw new Error("Runtime does not have an active engine. Did you forget to call .init()?");
        }
        return this.primaryEngine.lint();
    }

    state(): LT.SpiderState {
        if (!this.primaryEngine) {
            throw new Error("Runtime does not have an active engine. Did you forget to call .init()?");
        }
        const state = this.primaryEngine.state();
        // if the engine is finished but we noticed another case failed, need to mutate to say "dubious" instead
        if (state.state === LT.SpiderStateEnum.SUCCESS && this.failedCase !== undefined) {
            state.failedCase = this.failedCase;
            state.state = LT.SpiderStateEnum.DUBIOUS;
        }
        return state;
    }

    anim(): LT.SpiderAnimation[] {
        if (!this.primaryEngine) {
            throw new Error("Runtime does not have an active engine. Did you forget to call .init()?");
        }
        return this.primaryEngine.anim();
    }

    step(): undefined {
        if (!this.primaryEngine) {
            throw new Error("Runtime does not have an active engine. Did you forget to call .init()?");
        }
        this.primaryEngine.step();
        if (this.primaryEngine.stateSimple() === LT.SpiderStateEnum.SUCCESS) {
            // they passed one test, yes, but what about second test?
            for (let i = 0; i < this.puzzle.testCases.length; i++) {
                if (i === this.caseNum) {
                    continue;
                }
                const engine = new ExecutionEngine(this.puzzle, this.puzzle.testCases[i], this.programText, this.customVariables);
                do {
                    engine.step();
                } while (engine.stateSimple() === LT.SpiderStateEnum.RUNNING);
                if (engine.stateSimple() !== LT.SpiderStateEnum.SUCCESS) {
                    // uh oh! you failed one of the other test cases!
                    this.failedCase = i;
                    break;
                }
            }
        }
    }
}
