export interface TestCaseResult {
    testCaseId: number;
    passed: boolean;
    lastAttempt?: Date;
    executionTime?: number;  // in milliseconds
}

export class UserProgress {
    id: string;
    userId: string;
    levelId: string;
    completed: boolean;
    currentSolution?: string;  // Store the user's current code
    testCaseResults: TestCaseResult[];
    attempts: number;
    createdAt: Date;
    updatedAt: Date;
    lastAttemptAt?: Date;

    constructor(data: any) {
        this.id = data.id;
        this.userId = data.user_id;
        this.levelId = data.level_id;
        this.completed = data.completed;
        this.currentSolution = data.current_solution;
        this.testCaseResults = data.test_case_results || [];
        this.attempts = data.attempts || 0;
        this.createdAt = new Date(data.created_at);
        this.updatedAt = new Date(data.updated_at);
        this.lastAttemptAt = data.last_attempt_at ? new Date(data.last_attempt_at) : undefined;
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.userId,
            level_id: this.levelId,
            completed: this.completed,
            current_solution: this.currentSolution,
            test_case_results: this.testCaseResults,
            attempts: this.attempts,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
            last_attempt_at: this.lastAttemptAt
        };
    }

    // Helper method to update test case results
    updateTestCaseResult(testCaseId: number, passed: boolean) {
        const existingResult = this.testCaseResults.find(r => r.testCaseId === testCaseId);
        if (existingResult) {
            existingResult.passed = passed;
            existingResult.lastAttempt = new Date();
        } else {
            this.testCaseResults.push({
                testCaseId,
                passed,
                lastAttempt: new Date()
            });
        }
    }
} 