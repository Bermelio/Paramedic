"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const router = (0, express_1.Router)();
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await user_model_1.default.findOne({ email });
        console.log("Admin encontrado en DB:", admin);
        if (!admin) {
            res.status(400).json({ message: 'Credenciales inválidas' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, admin.password);
        if (!isMatch) {
            console.log("Contraseña incorrecta.");
            res.status(400).json({ message: 'Credenciales inválidas' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({
            userId: admin._id,
            email: admin.email
        }, process.env.JWT_SECRET || 'LeoMatioli2025', { expiresIn: '15m' });
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
    }
    catch (error) {
        console.error("Error completo en login:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
router.post('/logout', (req, res) => {
    res.clearCookie('authToken');
    res.json({ message: 'Logout exitoso' });
});
router.get('/verify', (req, res) => {
    const token = req.cookies.authToken;
    if (!token) {
        res.json({ authenticated: false });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "passtest");
        res.json({
            authenticated: true,
            user: {
                id: decoded.userId,
                email: decoded.email
            }
        });
    }
    catch (error) {
        console.log("Token inválido:", error);
        res.clearCookie('authToken');
        res.json({ authenticated: false });
    }
});
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'Usuario ya existe' });
            return;
        }
        const newUser = new user_model_1.default({
            email,
            password
        });
        await newUser.save();
        res.status(201).json({
            message: 'Usuario registrado exitosamente'
        });
    }
    catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
exports.default = router;
