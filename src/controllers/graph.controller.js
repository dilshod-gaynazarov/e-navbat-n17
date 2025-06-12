import Graph from '../models/graph.model.js';
import { handleError } from '../helpers/error-handle.js';
import { successRes } from '../helpers/success-response.js';
import { createGraphValidator, updateGraphValidator } from '../validation/graph.validation.js';
import Doctor from '../models/doctor.model.js';
import { isValidObjectId } from 'mongoose';

export class GraphController {
    async createGraph(req, res) {
        try {
            const { value, error } = createGraphValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            if (!isValidObjectId(value.doctorId)) {
                return handleError(res, 'Invalid ObjectId', 400);
            }
            const existsDoctor = await Doctor.findById(value.doctorId);
            if (!existsDoctor) {
                return handleError(res, 'Doctor is not defined', 400);
            }
            const isBusy = await Graph.findOne({ schedule: value.schedule });
            if (isBusy) {
                return handleError(res, 'Doctor is busy', 400);
            }
            const graph = await Graph.create(value);
            return successRes(res, graph, 201);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getAllGraphs(_, res) {
        try {
            const graphs = await Graph.find().populate('doctorId');
            return successRes(res, graphs);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async getGraphById(req, res) {
        try {
            const graph = await GraphController.findGraphById(res, req.params.id);
            return successRes(res, graph);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async updateGraph(req, res) {
        try {
            const id = req.params.id;
            await GraphController.findGraphById(res, id);
            const { value, error } = updateGraphValidator(req.body);
            if (error) {
                return handleError(res, error, 422);
            }
            if (value.schedule) {
                const isBusy = await Graph.findOne({ schedule: value.schedule });
                if (isBusy) {
                    return handleError(res, 'Doctor is busy', 400);
                }
            }
            if (value.doctorId) {
                if (!isValidObjectId(value.doctorId)) {
                    return handleError(res, 'Invalid Doctor ID', 400);
                }
                const existsDoctor = await Doctor.findById(value.doctorId);
                if (!existsDoctor) {
                    return handleError(res, 'Doctor is not defined', 400);
                }
            }
            const updatedGraph = await Graph.findByIdAndUpdate(id, value, { new: true });
            return successRes(res, updatedGraph);
        } catch (error) {
            return handleError(res, error);
        }
    }

    async deleteGraph(req, res) {
        try {
            const id = req.params.id;
            await GraphController.findGraphById(res, id);
            await Graph.findByIdAndDelete(id);
            return successRes(res, {message: 'Graph deleted successfully'});
        } catch (error) {
            return handleError(res, error);
        }
    }

    static async findGraphById(res, id) {
        try {
            if (!isValidObjectId(id)) {
                return handleError(res, 'Invalid ObjectId', 400);
            }
            const graph = await Graph.findById(id).populate('doctorId');
            if (!graph) {
                return handleError(res, 'Graph not found', 404);
            }
            return graph;
        } catch (error) {
            return handleError(res, error);
        }
    }
}