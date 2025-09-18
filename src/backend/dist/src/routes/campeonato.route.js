"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const campeonato_model_1 = __importDefault(require("../models/campeonato.model"));
const router = express_1.default.Router();
const isValidObjectId = (id) => mongoose_1.default.Types.ObjectId.isValid(id);
router.get("/", async (req, res) => {
    try {
        const campeonato = await campeonato_model_1.default.findOne({ habilitado: true })
            .sort({ updatedAt: -1 })
            .exec();
        if (!campeonato) {
            res.status(404).json({
                message: "No hay campeonato habilitado",
                data: null,
            });
            return;
        }
        res.json(campeonato);
    }
    catch (error) {
        console.error("Error al obtener campeonato:", error);
        res.status(500).json({
            message: "Server errorr",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
});
router.post("/", async (req, res) => {
    try {
        const { torneo, club, categoria, partidos, hora, habilitado, paramedico } = req.body;
        if (!torneo || !club || !categoria || !partidos || !hora) {
            res.status(400).json({
                message: "Todos los campos son requeridos",
                required: ["torneo", "club", "categoria", "partidos", "hora"]
            });
            return;
        }
        if (habilitado) {
            await campeonato_model_1.default.updateMany({ habilitado: true }, { habilitado: false });
        }
        const nuevoCampeonato = new campeonato_model_1.default({
            torneo,
            club,
            categoria,
            partidos,
            hora,
            habilitado: !!habilitado,
            paramedico: paramedico || null
        });
        const campeonatoGuardado = await nuevoCampeonato.save();
        res.status(201).json({
            message: "Campeonato guardado exitosamente",
            data: campeonatoGuardado
        });
    }
    catch (error) {
        console.error("Error al guardar campeonato:", error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : "Error desconocido"
        });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { torneo, club, categoria, partidos, hora, habilitado, paramedico } = req.body;
        if (!isValidObjectId(id)) {
            res.status(400).json({ message: "ID de campeonato inválido" });
            return;
        }
        if (habilitado) {
            await campeonato_model_1.default.updateMany({ _id: { $ne: id }, habilitado: true }, { habilitado: false });
        }
        const campeonatoActualizado = await campeonato_model_1.default.findByIdAndUpdate(id, { torneo, club, categoria, partidos, hora, habilitado: !!habilitado, paramedico }, { new: true, runValidators: true });
        if (!campeonatoActualizado) {
            res.status(404).json({ message: "Campeonato no encontrado" });
            return;
        }
        res.json({
            message: "Campeonato actualizado exitosamente",
            data: campeonatoActualizado,
        });
    }
    catch (error) {
        console.error("Error al actualizar campeonato:", error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            res.status(400).json({ message: "ID invalido" });
            return;
        }
        const campeonatoEliminado = await campeonato_model_1.default.findByIdAndDelete(id);
        if (!campeonatoEliminado) {
            res.status(404).json({ message: "Campeonato no encontrado" });
            return;
        }
        res.json({
            message: "Campeonato eliminado exitosamente",
            data: campeonatoEliminado,
        });
    }
    catch (error) {
        console.error("Error al eliminar campeonato:", error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
});
router.get("/all", async (req, res) => {
    try {
        const campeonatos = await campeonato_model_1.default.find().sort({ updatedAt: -1 }).exec();
        res.json({
            message: "Campeonatos obtenidos exitosamente",
            data: campeonatos,
            total: campeonatos.length,
        });
    }
    catch (error) {
        console.error("Error al obtener todos los campeonatos:", error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error instanceof Error ? error.message : "Error desconocido",
        });
    }
});
// --- SSE ---
router.get("/stream", async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
    const send = (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
    const campeonato = await campeonato_model_1.default.findOne({ habilitado: true })
        .sort({ updatedAt: -1 })
        .lean();
    send(campeonato || { habilitado: false });
    const changeStream = campeonato_model_1.default.watch();
    changeStream.on("change", async () => {
        const actualizado = await campeonato_model_1.default.findOne({ habilitado: true })
            .sort({ updatedAt: -1 })
            .lean();
        send(actualizado || { habilitado: false });
    });
    req.on("close", () => {
        changeStream.close();
        res.end();
    });
});
exports.default = router;
