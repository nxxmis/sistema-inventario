const mongoose = require('mongoose');

const sectorSchema = new mongoose.Schema({
    bodega_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bodega', required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Sector', sectorSchema);
