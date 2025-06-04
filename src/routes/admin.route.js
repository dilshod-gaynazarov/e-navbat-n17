import { Router } from "express";
import { AdminController } from '../controllers/admin.controller.js';

const router = Router();
const controller = new AdminController();

router
    .post('/', controller.createAdmin)

export default router;
