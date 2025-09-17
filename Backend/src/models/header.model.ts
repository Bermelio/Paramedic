import mongoose, {Schema, Document} from 'mongoose';

export interface IHeader extends Document {
  encuentro: string;
  fecha: string;
  hora: string;
  nombreDia: string;
}

const HeaderSchema: Schema = new Schema(
  {
    encuentro: {
      type: String,
      required: true
    },
    fecha: {
      type: String,
      required: true
    },
    hora: {
      type: String,
      required: true
    },
    nombreDia: {
      type: String,
      required: true
    }
  }
);

export default mongoose.model<IHeader>('Header', HeaderSchema, 'Header');