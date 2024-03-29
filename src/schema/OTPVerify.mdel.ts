import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const OTPSchema = new mongoose.Schema(
    {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        otp: { type: Number, required: true },
        type: { type: Number, default: 0 }, // 0 = Register, 1 = Reset Password 
        generatedAt: { type: Date, default: Date.now, expires: 300 }, // 5 minutes in seconds
    },
    { timestamps: true }
);

OTPSchema.index({ "user_id": 1 });

// paginate with this plugin
OTPSchema.plugin(paginate);

export default OTPSchema;
