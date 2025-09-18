import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin:
      NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://tu-app.onrender.com'
        : 'http://localhost:5173',
    credentials: true,
  })
);

import authHandler from './src/routes/auth.route';
import paramedicosHandler from './src/routes/paramedicos.route';
import canchasHandler from './src/routes/canchas.route';
import desingHandler from './src/routes/desing.route';
import campeonatoHandler from './src/routes/campeonato.route';
import headerHandler from './src/routes/header.route';

app.use('/api/auth', authHandler);
app.use('/api/paramedicos', paramedicosHandler);
app.use('/api/canchas', canchasHandler);
app.use('/api/desing', desingHandler);
app.use('/api/campeonato', campeonatoHandler);
app.use('/api/header', headerHandler);

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use((req: Request, res: Response) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ message: '❌ API endpoint not found' });
    return;
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 Error inesperado:', err.message);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('⚠️ MONGO_URI no está definida en variables de entorno');
}

mongoose.set('strictQuery', false);
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(
        `🚀 Servidor corriendo en ${
          NODE_ENV === 'production'
            ? `Render (puerto ${PORT})`
            : `http://localhost:${PORT}`
        }`
      );
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });
