import { Router } from "express";
import { DoctorController } from "../controllers/doctor.controller.js";

const router = Router();
const controller = new DoctorController();

router
    .post('/', controller.createDoctor)
    .get('/', controller.getAllDoctors)
    .get('/:id', controller.getDoctorById)
    .patch('/:id', controller.updateDoctor)
    .delete('/:id', controller.deleteDoctor)

export default router;
