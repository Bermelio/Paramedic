import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//routes
// import canchasHandler from './routes/canchas.route.ts';
// import paramedicosHandler from './routes/paramedicos.route.ts';

// app.use('/api/canchas', canchasHandler);
// app.use('/api/paramedicos', paramedicosHandler);
app.get('/', (req: Request, res: Response) => {
    res.send('API de Canchas y Paramédicos');
});

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in environment variables');
}
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log(err));

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});