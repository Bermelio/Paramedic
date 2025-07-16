import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Admin from '../models/user.model';

const router = Router();

// Interfaces para tipado
interface UserCredentials {
  email: string;
  password: string;
}

interface UserResponse {
  message: string;
  user?: {
    email: string;
  };
}

// Ruta de Login
router.post('/login', async (req: Request<{}, {}, UserCredentials>, res: Response<UserResponse>): Promise<void> => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }

    res.json({ 
      message: 'Login exitoso', 
      user: { email: admin.email } 
    });
  } catch (error) {
    console.error("Error completo:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta de Registro
router.post('/register', async (req: Request<{}, {}, UserCredentials>, res: Response<UserResponse>): Promise<void> => {
  const { email, password } = req.body;

  try {
    const existingUser = await Admin.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Usuario ya existe' });
      return;
    }

    const newUser = new Admin({ 
      email, 
      password // sin hashear aquí
    });
    
    await newUser.save();
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente' 
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


export default router;