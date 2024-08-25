import cron from "cron";
import "dotenv/config";
import https from "https";
import { PORT } from "../config/config.js";

const URL =
  process.env.NODE_ENV === "production"
    ? process.env.HOST
    : `http://localhost:${PORT}`;

const keepAwake = new cron.CronJob("*/1 * * * *", function () {
  console.log(`${URL}/ping`);

  https
    .get(`${URL}/ping`, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request sent successfully");
      } else {
        console.log("GET request failed", res.statusCode);
      }
    })
    .on("error", (e) => {
      console.error("Error while sending request", e);
    });
});

export default keepAwake;
