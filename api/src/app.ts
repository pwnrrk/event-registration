require("dotenv").config();
import express from "express";
import { createServer } from "http";
import createHttpError from "http-errors";
import morgan from "morgan";
import { connectToDatabase } from "./libs/mongo";
import indexRoute from "./routes";
import userRoute from "./routes/userRoutes";
import seatRoute from "./routes/seatRoutes";
import { createDefaultSeats } from "./repositories/seatRepository";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(morgan("dev"));

indexRoute.use("/users", userRoute);
indexRoute.use("/seats", seatRoute);

app.use("/api", indexRoute);
app.use(indexRoute);

app.use(function (req, res, next) {
  return next(createHttpError(404));
});

app.use(function (
  err: any,
  _: express.Request,
  res: express.Response,
  __: express.NextFunction
) {
  let status = err.status || 500;
  let message = err.message || "Internal Server Error";

  res
    .status(status)
    .json(process.env.NODE_ENV === "production" ? { message } : err);
});

const server = createServer(app);
const PORT = process.env.PORT || 3000;

connectToDatabase()
  // .then(() => createDefaultSeats())
  .then(() => {
    server.listen(PORT);
    server.on("listening", function () {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  });
