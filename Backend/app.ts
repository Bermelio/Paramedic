import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || 'https://tu-app.render.com'
        : 'http://localhost:5173',
    credentials: true
}));

// Importar rutas
import authHandler from './src/routes/auth.route';
import paramedicosHandler from './src/routes/paramedicos.route';
import canchasHandler from './src/routes/canchas.route';
import desingHandler from './src/routes/desing.route';
import campeonatoHandler from './src/routes/campeonato.route';
import headerHandler from './src/routes/header.route';

// Rutas de API
app.use('/api/auth', authHandler);
app.use('/api/paramedicos', paramedicosHandler);
app.use('/api/canchas', canchasHandler);
app.use('/api/desing', desingHandler);
app.use('/api/campeonato', campeonatoHandler);
app.use('/api/header', headerHandler);

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all alternativo usando middleware en lugar de route
app.use((req: Request, res: Response) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ message: 'API endpoint not found' });
        return;
    }
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI is not defined in environment variables');
}
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});