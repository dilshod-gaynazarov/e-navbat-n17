import { Router } from "express";
import { DoctorController } from "../controllers/doctor.controller.js";

const router = Router();
const controller = new DoctorController();

router
    .post('/', controller.createDoctor)
    .post('/signin', controller.signInDoctor)
    .post('/confirm-signin', controller.confirmSignInDoctor)
    .get('/', controller.getAllDoctors)
    .get('/:id', controller.getDoctorById)
    .patch('/:id', controller.updateDoctor)
    .delete('/:id', controller.deleteDoctor)

export default router;
