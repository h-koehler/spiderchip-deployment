import { Pool } from "pg";

export const pool = {
  query: jest.fn(), // Mock query function
  connect: jest.fn(),
  end: jest.fn(), // Mock connection close
} as unknown as Pool;
