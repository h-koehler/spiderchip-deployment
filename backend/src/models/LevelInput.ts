// This would contain the specific structure for the level's input data
export interface TestCase {
    input: any[];    // Will refine this type once input format is clear
    expectedOutput: any[];  // Will refine this type once output format is clear
    description?: string;  // Optional description of what the test case verifies
}

export class LevelInput {
    puzzleData: {
        initialState: any;  // Initial state of the puzzle
        constraints?: string[];  // Any constraints on the solution
        availableCommands: string[];  // Commands available to the user
    };
    
    testCases: TestCase[];
    
    // Optional metadata about the puzzle
    metadata?: {
        estimatedTime?: number;  // in minutes
        prerequisites?: string[];  // IDs of levels that should be completed first? Just a placeholder for now
    };

    constructor(data: any) {
        this.puzzleData = {
            initialState: data.puzzleData?.initialState || {},
            constraints: data.puzzleData?.constraints || [],
            availableCommands: data.puzzleData?.availableCommands || []
        };
        
        this.testCases = data.testCases || [];
        this.metadata = data.metadata;
    }

    toJSON() {
        return {
            puzzleData: this.puzzleData,
            testCases: this.testCases,
            metadata: this.metadata
        };
    }
} 