import express from 'express';
import Canchas from '../models/canchas.model';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const canchas = await Canchas.find();
    res.json(canchas);
  } catch (error) {
    console.error("Error fetching canchas:", error);
    res.status(500).json({ message: 'Error al obtener las canchas' });
  }
});

router.post('/', async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const canchas = await Canchas.insertMany(req.body);
      res.status(201).json(canchas);
      return;
    }

    const { name } = req.body;
    const newCancha = new Canchas({ name });
    await newCancha.save();
    res.status(201).json(newCancha);
  } catch (error) {
    console.error("Error creating cancha:", error);
    res.status(500).json({ message: 'Error al crear la cancha' });
  }
});

export default router;