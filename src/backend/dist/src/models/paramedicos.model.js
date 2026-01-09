"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ParamedicosSchema = new mongoose_1.default.Schema({
    fullname: { type: String, required: true }
});
const Paramedicos = mongoose_1.default.model('Paramedicos', ParamedicosSchema, 'Paramedicos');
exports.default = Paramedicos;
