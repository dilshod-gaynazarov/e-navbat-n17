import { Schema, model } from "mongoose";

const doctorSchema = new Schema({
    phoneNumber: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    special: { type: String, required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

doctorSchema.virtual('graphs', {
    ref: 'Graph',
    localField: '_id',
    foreignField: 'doctorId'
});

const Doctor = model('Doctor', doctorSchema);
export default Doctor;
