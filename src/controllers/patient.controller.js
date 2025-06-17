import Patient from '../models/patient.model.js';
import { handleError } from '../helpers/error-handle.js';
import { successRes } from '../helpers/success-response.js';
import {
    signUpPatientValidator,
    signInPatientValidator,
    confirmSignInPatientValidator,
    updatePatientValidator
} from '../validation/patient.validation.js';
import config from '../config/index.js';
import { Token } from '../utils/token-service.js';
import { generateOTP } from '../helpers/generate-otp.js';
import NodeCache from 'node-cache';
import { transporter } from '../helpers/send-mail.js';

const token = new Token();
const cache = new NodeCache();

export class PatientController {
    async signUp(req, res) {
        try {
            const { value, error } = signUpPatientValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const existsPhone = await Patient.findOne({ phoneNumber: value.phoneNumber });
            if (existsPhone) {
                return handleError(res, 'Phone number already registred', 409);
            }
            const existsEmail = await Patient.findOne({ email: value.email });
            if (existsEmail) {
                return handleError(res, 'Email address already registred', 409);
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

    async signIn(req, res) {
        try {
            const { value, error } = signInPatientValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const email = value.email;
            const patient = await Patient.findOne({ email });
            if (!patient) {
                return handleError(res, 'Patient not found', 404);
            }
            const otp = generateOTP();
            const mailOptions = {
                from: config.MAIL_USER,
                to: email,
                subject: 'e-navbat',
                text: otp
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return handleError(res, 'Error on sending to email', 400);
                } else {
                    console.log(info);
                }
            })
            cache.set(email, otp, 120);
            return successRes(res, {
                message: 'OTP sent successfully to email'
            });
        } catch (error) {
            return handleError(res, error);
        }
    }

    async confirmSignIn(req, res) {
        try {
            const { value, error } = confirmSignInPatientValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            const patient = await Patient.findOne({ email: value.email });
            if (!patient) {
                return handleError(res, 'Patient not found', 404);
            }
            const cacheOTP = cache.get(value.email);
            if (!cacheOTP || cacheOTP != value.otp) {
                return handleError(res, 'OTP expired', 400);
            }
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