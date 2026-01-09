"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const header_model_1 = __importDefault(require("../models/header.model"));
const mongoose_1 = require("mongoose");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        const header = await header_model_1.default.findOne().exec();
        if (!header) {
            res.status(404).json({
                message: "No se encontró data del header",
                data: null
            });
            return;
        }
        res.json(header);
    }
    catch (error) {
        console.error("Error al obtener header:", error);
        res.status(500).json({
            message: "Server error",
            error: error instanceof Error ? error.message : "Error desconocido"
        });
    }
});
router.post("/", async (req, res) => {
    try {
        const { encuentro, fecha, hora, nombreDia } = req.body;
        if (!encuentro || !fecha || !hora || !nombreDia) {
            res.status(400).json({
                message: "Todos los campos son requeridos",
                required: ["encuentro", "fecha", "hora", "nombreDia"]
            });
            return;
        }
        const nuevoHeader = new header_model_1.default({
            encuentro,
            fecha,
            hora,
            nombreDia
        });
        const headerGuardado = await nuevoHeader.save();
        res.status(201).json({
            message: "Header Guardado con Exito!",
            data: headerGuardado
        });
    }
    catch (error) {
        console.error("Error al guardar header", error);
        res.status(500).json({
            message: "Error interno",
            error: error instanceof Error ? error.message : "Error desconocido"
        });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }
        const { encuentro, fecha, hora, nombreDia } = req.body;
        if (!encuentro || !fecha || !hora || !nombreDia) {
            res.status(400).json({
                message: "Todos los campos son requeridos",
                required: ["encuentro", "fecha", "hora", "nombreDia"],
            });
            return;
        }
        const headerActualizado = await header_model_1.default.findByIdAndUpdate(id, { encuentro, fecha, hora, nombreDia }, { new: true, runValidators: true }).exec();
        if (!headerActualizado) {
            res.status(404).json({ message: "Header no encontrado" });
            return;
        }
        res.json({
            message: "Header actualizado con éxito",
            data: headerActualizado,
        });
    }
    catch (error) {
        console.error("Error al actualizar header:", error);
        res.status(500).json({
            message: "Error interno",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            res.status(400).json({ message: "ID inválido" });
            return;
        }
        const headerEliminado = await header_model_1.default.findByIdAndDelete(id).exec();
        if (!headerEliminado) {
            res.status(404).json({ message: "Header no encontrado" });
            return;
        }
        res.json({
            message: "Header eliminado con éxito",
            data: headerEliminado,
        });
    }
    catch (error) {
        console.error("Error al eliminar header:", error);
        res.status(500).json({
            message: "Error interno",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
});
exports.default = router;
