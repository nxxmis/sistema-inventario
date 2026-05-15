const mongoose = require('mongoose');

const estanteSchema = new mongoose.Schema({
    sector_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Sector', required: true },
    nombre: { type: String, required: true },
    capacidad: { type: Number, default: 6 },
    descripcion: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Estante', estanteSchema);
