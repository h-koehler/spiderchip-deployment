import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/test/setup.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,
  testTimeout: 60000,

  // Improve test performance
  maxWorkers: "50%", // Use half of CPU cores
  verbose: true, // Display individual test results
  forceExit: true
};

export default config;