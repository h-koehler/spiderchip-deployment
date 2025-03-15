import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/test/setup.ts"],

  moduleNameMapper: {
    "^@config/db$": "./src/test/db.ts",
  },

  transform: {
    "^.+\\.ts$": ["ts-jest", { isolatedModules: true }],
  },

  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true,

  // Improve test performance
  maxWorkers: "50%", // Use half of CPU cores
  verbose: true, // Display individual test results
  forceExit: true
};

export default config;