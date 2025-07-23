import mongoose from 'mongoose';

const CanchasSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

const Canchas = mongoose.model('Canchas', CanchasSchema, 'Canchas');

export default Canchas;