import Patient from '../models/patient.model.js';
import { handleError } from '../helpers/error-handle.js';
import { successRes } from '../helpers/success-response.js';
import {
    createPatientValidator,
    updatePatientValidator
} from '../validation/patient.validation.js';
import config from '../config/index.js';
import { Token } from '../utils/token-service.js';

const token = new Token();

export class PatientController {
    async signUp(req, res) {
        try {
            const { value, error } = createPatientValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const existsPhone = await Patient.findOne({ phoneNumber: value.phoneNumber });
            if (existsPhone) {
                return handleError(res, 'Phone number already registred', 409);
            }
            const patient = await Patient.create(value);
            const payload = { id: patient._id };
            const accessToken = await token.generateAccessToken(payload);
            const refreshToken = await token.generateRefreshToken(payload);
            res.cookie('refreshTokenPatient', refreshToken, {
                httpOnly: true,
                secure: true,
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return successRes(res, {
                data: patient,
                token: accessToken
            }, 201);
        } catch (error) {
            return handleError(res, error);
        }
    }
}