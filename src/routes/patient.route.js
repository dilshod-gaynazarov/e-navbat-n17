import { Router } from "express";
import { PatientController } from "../controllers/patient.controller.js";

const router = Router();
const controller = new PatientController();

router
    .post('/signup', controller.signUp)

export default router;
