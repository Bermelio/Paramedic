import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/user.model';

const router = Router();

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

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    console.log("Admin encontrado en DB:", admin);

    if (!admin) {
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("Contraseña incorrecta.");
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }

    const token = jwt.sign(
      { 
        userId: admin._id, 
        email: admin.email 
      },
      process.env.JWT_SECRET || 'LeoMatioli2025',
      { expiresIn: '15m' }
    );

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    console.log("Login exitoso y token enviado.");
    res.json({ 
      message: 'Login exitoso',
      user: { email: admin.email }
    });
  } catch (error) {
    console.error("Error completo en login:", error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

router.post('/logout', (req: Request, res: Response): void => {
  res.clearCookie('authToken');
  res.json({ message: 'Logout exitoso' });
});

router.get('/verify', (req: Request, res: Response): void => {
  const token = req.cookies.authToken;

  if (!token) {
    res.json({ authenticated: false });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "passtest") as any;
    res.json({
      authenticated: true,
      user: { 
        id: decoded.userId, 
        email: decoded.email 
      }
    });
  } catch (error) {
    console.log("Token inválido:", error);
    res.clearCookie('authToken');
    res.json({ authenticated: false });
  }
});

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
      password
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