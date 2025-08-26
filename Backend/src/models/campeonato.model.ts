import mongoose, { Schema, Document } from 'mongoose';

export interface ICampeonato extends Document {
  torneo: string;
  club: string;
  categoria: string;
  partidos: string;
  hora: string;
  habilitado: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CampeonatoSchema: Schema = new Schema(
  {
    paramedico:{
      type: String,
    },
    torneo: {
      type: String,
    },
    club: {
      type: String,
    },
    categoria: {
      type: String,
    },
    partidos: {
      type: String,
    },
    hora: {
      type: String
    },
    habilitado: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICampeonato>('Campeonato', CampeonatoSchema, 'Campeonatos');