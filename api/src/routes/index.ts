import { Router } from "express";

const indexRoute = Router();

indexRoute.get("/", function (_, res) {
  res.json({
    name: "event-registration",
    version: "0.0.1",
  });
});

export default indexRoute;
