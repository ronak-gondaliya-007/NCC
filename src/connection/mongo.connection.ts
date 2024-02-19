import mongoose, { mongo, set } from "mongoose";
import config from "../utils/config";

export default async function () {
    return new Promise((resolver: any, reject: any) => {
        mongoose
            .connect(config.MONGODB.URL + config.MONGODB.NAME)
            .then(() => {
                console.info('🚀 MongoDB connection is now open : ' + config.MONGODB.NAME);
                resolver();
            })
            .catch((error: any) => {
                console.error('🚨 MongoDB connection error : ', error);
                reject();
            });
    });
}
