import { isValidObjectId } from "mongoose";
import { handleError } from "../helpers/error-handle.js";
import { successRes } from "../helpers/success-response.js";
import Doctor from "../models/doctor.model.js";
import { createDoctorValidator, updateDoctorValidator } from "../validation/doctor.validation.js";
import Graph from '../models/graph.model.js';

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