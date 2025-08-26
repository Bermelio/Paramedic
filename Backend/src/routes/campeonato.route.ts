import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Campeonato from "../models/campeonato.model";

const router = express.Router();

const isValidObjectId = (id: string): boolean => mongoose.Types.ObjectId.isValid(id);

interface CampeonatoBody {
  torneo: string;
  club: string;
  categoria: string;
  partidos: number;
  hora: string;
  habilitado?: boolean;
  paramedico?: string; 
}

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const campeonato = await Campeonato.findOne({ habilitado: true })
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
  } catch (error) {
    console.error("Error al obtener campeonato:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

router.post("/", async (req: Request<{}, {}, CampeonatoBody>, res: Response): Promise<void> => {
  try {
    const { torneo, club, categoria, partidos, hora, habilitado, paramedico } = req.body;

    if (!torneo || !club || !categoria || !partidos || !hora) {
      res.status(400).json({
        message: "Todos los campos son requeridos",
        required: ["torneo", "club", "categoria", "partidos", "hora"],
      });
      return;
    }

    if (habilitado) {
      await Campeonato.updateMany({ habilitado: true }, { habilitado: false });
    }

    const nuevoCampeonato = new Campeonato({
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
      data: campeonatoGuardado,
    });
  } catch (error) {
    console.error("Error al guardar campeonato:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

router.put("/:id", async (req: Request<{ id: string }, {}, CampeonatoBody>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { torneo, club, categoria, partidos, hora, habilitado, paramedico } = req.body;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "ID de campeonato inválido" });
      return;
    }

    if (habilitado) {
      await Campeonato.updateMany(
        { _id: { $ne: id }, habilitado: true },
        { habilitado: false }
      );
    }

    const campeonatoActualizado = await Campeonato.findByIdAndUpdate(
      id,
      { torneo, club, categoria, partidos, hora, habilitado: !!habilitado, paramedico },
      { new: true, runValidators: true }
    );

    if (!campeonatoActualizado) {
      res.status(404).json({ message: "Campeonato no encontrado" });
      return;
    }

    res.json({
      message: "Campeonato actualizado exitosamente",
      data: campeonatoActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar campeonato:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

router.delete("/:id", async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "ID de campeonato inválido" });
      return;
    }

    const campeonatoEliminado = await Campeonato.findByIdAndDelete(id);

    if (!campeonatoEliminado) {
      res.status(404).json({ message: "Campeonato no encontrado" });
      return;
    }

    res.json({
      message: "Campeonato eliminado exitosamente",
      data: campeonatoEliminado,
    });
  } catch (error) {
    console.error("Error al eliminar campeonato:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

router.get("/all", async (req: Request, res: Response): Promise<void> => {
  try {
    const campeonatos = await Campeonato.find().sort({ updatedAt: -1 }).exec();

    res.json({
      message: "Campeonatos obtenidos exitosamente",
      data: campeonatos,
      total: campeonatos.length,
    });
  } catch (error) {
    console.error("Error al obtener todos los campeonatos:", error);
    res.status(500).json({
      message: "Error interno del servidor",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

export default router;
