import { Router } from "express";
import { GraphController } from "../controllers/graph.controller.js";

const router = Router();
const controller = new GraphController();

router
    .post('/', controller.createGraph)
    .get('/', controller.getAllGraphs)
    .get('/:id', controller.getGraphById)
    .patch('/:id', controller.updateGraph)
    .delete('/:id', controller.deleteGraph)

export default router;
