"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const canchas_model_1 = __importDefault(require("../models/canchas.model"));
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const canchas = await canchas_model_1.default.find();
        res.json(canchas);
    }
    catch (error) {
        console.error("Error fetching canchas:", error);
        res.status(500).json({ message: 'Error al obtener las canchas' });
    }
});
router.post('/', async (req, res) => {
    try {
        if (Array.isArray(req.body)) {
            const canchas = await canchas_model_1.default.insertMany(req.body);
            res.status(201).json(canchas);
            return;
        }
        const { name } = req.body;
        const newCancha = new canchas_model_1.default({ name });
        await newCancha.save();
        res.status(201).json(newCancha);
    }
    catch (error) {
        console.error("Error creating cancha:", error);
        res.status(500).json({ message: 'Error al crear la cancha' });
    }
});
exports.default = router;
