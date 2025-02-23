import dotenv from "dotenv";
import { StringValue } from "ms";

dotenv.config();

const globalConfig = {
  app: {
    port: process.env.PORT || 4000
  },
  db: {
    user: process.env.DB_USER || "spiderchip",
    password: process.env.DB_PASSWORD || "password",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || "spiderchip",
    connectionString: process.env.DATABASE_URL || 
      `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
  },
  jwt: {
    secret: process.env.JWT_SECRET || "spiderchip-secret-VUHuaXCqROP",
    expiresIn: (process.env.JWT_EXPIRES_IN as StringValue | number) || "1h"
  }
};

export default globalConfig;
