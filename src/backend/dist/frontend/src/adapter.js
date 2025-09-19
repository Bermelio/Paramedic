"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_BASE_URL = void 0;
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://paramedic-rbfh.onrender.com'
    : 'http://localhost:5000';
exports.API_BASE_URL = API_BASE_URL;
