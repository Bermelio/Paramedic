"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://paramedic-rbfh.onrender.com'
        : 'http://localhost:5173',
    credentials: true,
}));
const auth_route_1 = __importDefault(require("./src/routes/auth.route"));
const paramedicos_route_1 = __importDefault(require("./src/routes/paramedicos.route"));
const canchas_route_1 = __importDefault(require("./src/routes/canchas.route"));
const desing_route_1 = __importDefault(require("./src/routes/desing.route"));
const campeonato_route_1 = __importDefault(require("./src/routes/campeonato.route"));
const header_route_1 = __importDefault(require("./src/routes/header.route"));
app.use('/api/auth', auth_route_1.default);
app.use('/api/paramedicos', paramedicos_route_1.default);
app.use('/api/canchas', canchas_route_1.default);
app.use('/api/desing', desing_route_1.default);
app.use('/api/campeonato', campeonato_route_1.default);
app.use('/api/header', header_route_1.default);
const frontendPath = path_1.default.join(__dirname, '../frontend/dist');
if (fs_1.default.existsSync(frontendPath)) {
    console.log('✅ Frontend encontrado, sirviendo archivos estáticos');
    app.use(express_1.default.static(frontendPath));
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api/')) {
            res.status(404).json({ message: '❌ API endpoint not found' });
            return;
        }
        res.sendFile(path_1.default.join(frontendPath, 'index.html'));
    });
}
else {
    console.log('⚠️ Frontend no encontrado, sirviendo solo API');
    app.get('/', (req, res) => {
        res.json({
            message: '🚀 API funcionando correctamente',
            endpoints: [
                '/api/auth',
                '/api/paramedicos',
                '/api/canchas',
                '/api/desing',
                '/api/campeonato',
                '/api/header'
            ]
        });
    });
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api/')) {
            res.status(404).json({ message: '❌ API endpoint not found' });
            return;
        }
        res.status(404).json({ message: '❌ Frontend no disponible' });
    });
}
app.use((err, req, res, _next) => {
    console.error('🔥 Error inesperado:', err.message);
    res.status(500).json({ message: 'Error interno del servidor' });
});
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error('⚠️ MONGO_URI no está definida en variables de entorno');
}
mongoose_1.default.set('strictQuery', false);
mongoose_1.default
    .connect(mongoUri)
    .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en ${NODE_ENV === 'production'
            ? `Render (puerto ${PORT})`
            : `http://localhost:${PORT}`}`);
    });
})
    .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
});
