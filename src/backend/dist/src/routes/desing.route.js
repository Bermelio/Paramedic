"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const desing_model_1 = __importDefault(require("../models/desing.model"));
const paramedicos_model_1 = __importDefault(require("../models/paramedicos.model"));
const canchas_model_1 = __importDefault(require("../models/canchas.model"));
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    try {
        console.log('Datos recibidos en el backend:', req.body);
        await desing_model_1.default.deleteMany({});
        console.log('Datos anteriores eliminados');
        const nuevoDesing = await desing_model_1.default.insertMany(req.body);
        console.log('Nuevos datos guardados:', nuevoDesing.length, 'registros');
        res.status(201).json(nuevoDesing);
        return;
    }
    catch (error) {
        console.error('Error al guardar desing:', error);
        res.status(500).json({ error: 'Error al guardar el desing' });
        return;
    }
});
router.get('/', async (req, res) => {
    try {
        const designs = await desing_model_1.default.find({});
        const designsConDatos = await Promise.all(designs.map(async (design, index) => {
            let paramedicoNombre = '-';
            let canchaNombre = '-';
            let cambioNombre = '-';
            if (design.paramedicoId !== '-') {
                try {
                    const paramedico = await paramedicos_model_1.default.findById(design.paramedicoId);
                    paramedicoNombre = paramedico ? paramedico.fullname : 'No encontrado';
                }
                catch (err) {
                    console.log('Error buscando paramédico:', design.paramedicoId);
                    paramedicoNombre = 'Error';
                }
            }
            if (design.canchaId !== '-') {
                try {
                    const cancha = await canchas_model_1.default.findById(design.canchaId);
                    canchaNombre = cancha ? cancha.name : 'No encontrada';
                }
                catch (err) {
                    console.log('Error buscando cancha:', design.canchaId);
                    canchaNombre = 'Error';
                }
            }
            if (design.cambioId !== '-') {
                try {
                    const cambio = await canchas_model_1.default.findById(design.cambioId);
                    cambioNombre = cambio ? cambio.name : 'No encontrada';
                }
                catch (err) {
                    console.log('Error buscando cambio:', design.cambioId);
                    cambioNombre = 'Error';
                }
            }
            return {
                _id: design._id,
                number: String(index + 1).padStart(2, '0'),
                club: canchaNombre,
                paramedico: paramedicoNombre,
                cambio: cambioNombre,
                hora: design.hora ? String(design.hora) : '12:00'
            };
        }));
        res.status(200).json(designsConDatos);
    }
    catch (error) {
        console.error('Error al obtener designs:', error);
        res.status(500).json({ error: 'Error al obtener los designs' });
    }
});
exports.default = router;
