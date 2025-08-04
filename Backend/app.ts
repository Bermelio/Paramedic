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
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

//routes
import authHandler from './src/routes/auth.route';
import paramedicosHandler from './src/routes/paramedicos.route';
import canchasHandler from './src/routes/canchas.route';
import desingHandler from './src/routes/desing.route';

app.use('/api/auth', authHandler);
app.use('/api/paramedicos', paramedicosHandler);
app.use('/api/canchas', canchasHandler);
app.use('/api/desing', desingHandler);

// Main route
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