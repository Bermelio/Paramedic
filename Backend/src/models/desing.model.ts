import mongoose from 'mongoose';

const desingSchema = new mongoose.Schema({
  paramedicoId: String,
  canchaId: String,
  cambioId: String,
});

export default mongoose.model('Desings', desingSchema, 'Desings');
