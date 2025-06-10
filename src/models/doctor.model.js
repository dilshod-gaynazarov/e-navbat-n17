import { Schema, model } from "mongoose";

const doctorSchema = new Schema({
    phoneNumber: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    special: { type: String, required: true }
}, { timestamps: true });

const Doctor = model('Doctor', doctorSchema);
export default Doctor;
