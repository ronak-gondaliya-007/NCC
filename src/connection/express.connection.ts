import express from "express";
import cors from "cors";
import { logger } from "../utils/logger";
import Routes from './../api';

export default async function (app: any) {

  app.use(express.json({ limit: "50mb", type: ["application/json", "text/plain"] }));

  app.use(cors());

  app.use('/export', express.static('download'));

  app.use(express.urlencoded({ extended: true }));

  app.use((req: any, res: any, next: any) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use((req: any, res: any, next: any) => {
    logger.info(`New Request Method: ${req.method} And Fired On: ${req.path}`);
    next();
  });

  app.use("/Health", async (req: any, res: any, next: any) => {
    res.send({
      date: new Date(),
      Message: "Health 100% ...",
    });
  });

  /** Application API Routes */
  app.use('/api', Routes);
}
