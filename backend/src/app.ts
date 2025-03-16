import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import dotenv from "dotenv";
import { NotFoundError } from "./errors";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/api", routes);

app.all("*", async (res, req, next) => {
  return next(new NotFoundError());
});

app.use(errorHandler as express.ErrorRequestHandler);

export default app;
