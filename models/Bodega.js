const mongoose = require('mongoose');

const bodegaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Bodega', bodegaSchema);
