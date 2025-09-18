import express, { Request, Response } from "express";
import Header from "../models/header.model";
import { isValidObjectId } from "mongoose";

const router = express.Router();

interface HeaderBody {
  encuentro: string;
  fecha: string;
  hora: string;
  nombreDia: string;
}   

router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const header = await Header.findOne().exec();
    if (!header) {
      res.status(404).json({
        message: "No se encontró data del header",
        data: null
      });
      return;
    }

    res.json(header);
} catch (error) {
    console.error("Error al obtener header:", error);
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Error desconocido"
    });
  }
});

router.post("/",async (req: Request, res: Response): Promise<void> => {
  try {
    const {encuentro, fecha, hora, nombreDia} = req.body;

    if (!encuentro || !fecha || !hora || !nombreDia){
      res.status(400 ).json({
        message: "Todos los campos son requeridos",
        required: ["encuentro", "fecha", "hora", "nombreDia"]
      });
      return;
    }

    const nuevoHeader = new Header({
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
  } catch (error) {
    console.error("Error al guardar header", error);
    res.status(500).json({
      message: "Error interno",
      error: error instanceof Error ? error.message: "Error desconocido"
    });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const { encuentro, fecha, hora, nombreDia} = req.body;

    if (!encuentro || !fecha || !hora || !nombreDia) {
      res.status(400).json({
        message: "Todos los campos son requeridos",
        required: ["encuentro", "fecha", "hora", "nombreDia"],
      });
      return;
    }

    const headerActualizado = await Header.findByIdAndUpdate(
      id,
      { encuentro, fecha, hora, nombreDia},
      { new: true, runValidators: true }
    ).exec();

    if (!headerActualizado) {
      res.status(404).json({ message: "Header no encontrado" });
      return;
    }

    res.json({
      message: "Header actualizado con éxito",
      data: headerActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar header:", error);
    res.status(500).json({
      message: "Error interno",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: "ID inválido" });
      return;
    }

    const headerEliminado = await Header.findByIdAndDelete(id).exec();

    if (!headerEliminado) {
      res.status(404).json({ message: "Header no encontrado" });
      return;
    }

    res.json({
      message: "Header eliminado con éxito",
      data: headerEliminado,
    });
  } catch (error) {
    console.error("Error al eliminar header:", error);
    res.status(500).json({
      message: "Error interno",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

export default router;