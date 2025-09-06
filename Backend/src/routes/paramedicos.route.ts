import express from 'express';
import Paramedicos from '../models/paramedicos.model';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const paramedicos = await Paramedicos.find();
    res.json(paramedicos);
  } catch (error) {
    console.error("Error fetching paramedicos:", error);
    res.status(500).json({ message: 'Error al obtener los paramédicos' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const paramedicos = await Paramedicos.insertMany(req.body);
      res.status(201).json(paramedicos);
      return;
    }

    const { fullname } = req.body;
    const newParamedico = new Paramedicos({ fullname });
    await newParamedico.save();
    res.status(201).json(newParamedico);
  } catch (error) {
    console.error("Error creating paramedico:", error);
    res.status(500).json({ message: 'Error al crear el paramédico' });
  }
});

export default router;