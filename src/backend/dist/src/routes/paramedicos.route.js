"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paramedicos_model_1 = __importDefault(require("../models/paramedicos.model"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const paramedicos = await paramedicos_model_1.default.find();
        res.json(paramedicos);
    }
    catch (error) {
        console.error("Error fetching paramedicos:", error);
        res.status(500).json({ message: 'Error al obtener los paramédicos' });
    }
});
router.post('/', async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const paramedicos = await paramedicos_model_1.default.insertMany(req.body);
            res.status(201).json(paramedicos);
            return;
        }
        const { fullname } = req.body;
        const newParamedico = new paramedicos_model_1.default({ fullname });
        await newParamedico.save();
        res.status(201).json(newParamedico);
    }
    catch (error) {
        console.error("Error creating paramedico:", error);
        res.status(500).json({ message: 'Error al crear el paramédico' });
    }
});
exports.default = router;
