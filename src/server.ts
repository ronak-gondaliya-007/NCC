import express from "express";
import config from "./utils/config";
import expressConnect from "./connection/express.connection";
import mongooseConnect from "./connection/mongo.connection";
import fs from "fs";
import http from "http";
import https from "https";
import './config/passport';

let app = express();

//Granting express Loaders to App
expressConnect(app);

const configServer = {
  SSL: {
    key: config.SSL.KEY,
    cert: config.SSL.CERTIFICATE
  },
  server: {
    env: config.SERVER.ENVIRONMENT
  },
};

let server: http.Server | https.Server;

try {
  const key = fs.readFileSync(configServer.SSL.key);
  const cert = fs.readFileSync(configServer.SSL.cert);

  // If the certificate and key are successfully read, create an HTTPS server
  server = https.createServer({ key, cert }, app);
} catch (err: any) {
  // If an error occurs, create an HTTP server
  server = http.createServer(app);
}

//while entire promise is resolve then server will started
Promise.all([mongooseConnect()])
  .then(() => {
    server.listen(config.SERVER.PORT, () => {
      console.info(`🚀 Server Started on 🖥️  http://localhost:${config.SERVER.PORT} ✨`);
    });
  })
  .catch((error:any) => {
    console.log("🚨 Server connection error : ", error);
  });