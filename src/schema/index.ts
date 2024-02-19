import mongoose from "mongoose";
import UserSchema from "./user";
import { UserInterface } from "./../interface/user.interface";

export default {
    User: mongoose.model<UserInterface & mongoose.Document>('User', UserSchema)
};