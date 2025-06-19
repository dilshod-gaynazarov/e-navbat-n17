import { isValidObjectId } from "mongoose";
import { handleError } from "../helpers/error-handle.js";
import { successRes } from "../helpers/success-response.js";
import Doctor from "../models/doctor.model.js";
import { confirmSignInDoctorValidator, createDoctorValidator, signInDoctorValidator, updateDoctorValidator } from "../validation/doctor.validation.js";
import Graph from '../models/graph.model.js';
import { generateOTP } from '../helpers/generate-otp.js';
import NodeCache from "node-cache";
import { sendSMS } from '../helpers/send-sms.js';
import { Token } from '../utils/token-service.js';

const cache = new NodeCache();
const token = new Token();

export class DoctorController {
    async createDoctor(req, res) {
        try {
            const { value, error } = createDoctorValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const existsPhoneNumber = await Doctor.findOne({ phoneNumber: value.phoneNumber });
            if (existsPhoneNumber) {
                return handleError(res, 'Phone number already exists', 409);
            }
            const doctor = await Doctor.create(value)
            return successRes(res, doctor, 201);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async signInDoctor(req, res) {
        try {
            const { value, error } = signInDoctorValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const { phoneNumber } = value;
            const doctor = await Doctor.findOne({ phoneNumber });
            if (!doctor) {
                return handleError(res, 'Doctor not found', 404);
            }
            const otp = generateOTP();
            cache.set(phoneNumber, otp, 120);
            const sms = "Sizning tasdiqlash parolingiz: " + otp;
            await sendSMS(phoneNumber.split('+')[1], sms);
            return successRes(res, {});
        } catch (error) {
            return handleError(res, error);
        }
    }

    async confirmSignInDoctor(req, res) {
        try {
            const { value, error } = confirmSignInDoctorValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const doctor = await Doctor.findOne({ phoneNumber: value.phoneNumber });
            if (!doctor) {
                return handleError(res, 'Doctor not found', 404);
            }
            const cacheOTP = cache.get(value.phoneNumber);
            if (!cacheOTP || cacheOTP != value.otp) {
                return handleError(res, 'OTP expired', 400);
            }
            cache.del(value.phoneNumber);
            const payload = { id: doctor._id };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenDoctor', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return successRes(res, {
                data: doctor,
                token: accessToken
            }, 200);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getAllDoctors(_, res) {
        try {
            const doctors = await Doctor.find().populate('graphs');
            return successRes(res, doctors);
        } catch (error) {
            return handleError(res, error)
        }
    }

    async getDoctorById(req, res) {
        try {
            const doctor = await DoctorController.findDoctorById(res, req.params.id);
            return successRes(res, doctor);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async updateDoctor(req, res) {
        try {
            const { value, error } = updateDoctorValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            await DoctorController.findDoctorById(res, id);
            const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, value, { new: true });
            return successRes(res, updatedDoctor);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async deleteDoctor(req, res) {
        try {
            const id = req.params.id;
            await DoctorController.findDoctorById(res, id);
            await Doctor.findByIdAndDelete(id);
            await Graph.deleteMany({ doctorId: id });
            return successRes(res, { message: 'Doctor deleted successfully' });
        } catch (error) {
            return handleError(res, error);
        }
    }

    static async findDoctorById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return handleError(res, 'Invalid object ID', 400);
            }
            const doctor = await Doctor.findById(id).populate('graphs');
            if (!doctor) {
                return handleError(res, 'Doctor not found', 404);
            }
            return doctor;
        } catch (error) {
            return handleError(res, error);
        }
    }
}