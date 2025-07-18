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
router.post('/login', async (req:Request , res: Response):Promise<void> =>  {
  const { email, password } = req.body;
  console.log("Login recibido en backend:", { email, password });

  try {
    const admin = await Admin.findOne({ email });
    console.log("Admin encontrado en DB:", admin);

    if (!admin) {
      console.log("No se encontró usuario.");
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("¿Contraseña coincide?:", isMatch);

    if (!isMatch) {
      console.log("Contraseña incorrecta.");
      res.status(400).json({ message: 'Credenciales inválidas' });
      return;
    }

    console.log("Login exitoso.");
    res.json({ message: 'Login exitoso' });
  } catch (error) {
    console.error("Error completo en login:", error);
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