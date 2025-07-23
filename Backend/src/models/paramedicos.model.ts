import mongoose from 'mongoose';

const ParamedicosSchema = new mongoose.Schema({
  fullname: { type: String, required: true }
});

const Paramedicos = mongoose.model('Paramedicos', ParamedicosSchema, 'Paramedicos');

export default Paramedicos;