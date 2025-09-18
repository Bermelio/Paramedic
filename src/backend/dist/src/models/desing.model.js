"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const desingSchema = new mongoose_1.default.Schema({
    paramedicoId: String,
    canchaId: String,
    cambioId: String,
    hora: String
});
exports.default = mongoose_1.default.model('Desings', desingSchema, 'Desings');
