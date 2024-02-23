import mongoose from 'mongoose';
import { USER_TYPE } from './../utils/const';

const BussinessSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        mobile: { type: String, unique: true, trim: true, required: true },
        email: { type: String, lowercase: true, unique: true, required: true },
        address: {
            address: { type: String },
            temproryAddress: { type: String },
            province: { type: String },
            city: { type: String },
            country: { type: String },
            zipCode: { type: String },
            countryISO: { type: String },
            stateISO: { type: String },
            location: {
                type: { type: String, default: "Point" },
                coordinates: { type: [Number], default: [0, 0] },
            },
        },
        category: { type: [String], validate: [validateCategories, '{PATH} exceeds the limit of 3 categories.'] },
        userType: { type: String, enum: Object.values(USER_TYPE), required: true },
    },
    { timestamps: true }
);

function validateCategories(val) {
    return val.length <= 3;
  }

BussinessSchema.index({ "address.location": '2dsphere' });

export default BussinessSchema;
