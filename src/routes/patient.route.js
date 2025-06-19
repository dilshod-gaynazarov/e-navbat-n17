import { Router } from "express";
import { PatientController } from "../controllers/patient.controller.js";

const router = Router();
const controller = new PatientController();

router
    .post('/signup', controller.signUp)
    .post('/signin', controller.signIn)
    .post('/confirm-signin', controller.confirmSignIn)
    .post('/token', controller.newAccessToken)
    .post('/logout', controller.logOut)

export default router;
