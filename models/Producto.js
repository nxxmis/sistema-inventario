const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    estante_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Estante', required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String },
    cantidad_inicial: { type: Number, required: true, default: 0 },
    cantidad_actual: { type: Number, required: true, default: 0 },
    codigo_barras: { type: String },
    precio: { type: Number },
}, { timestamps: true });

// Método virtual para determinar el color de stock
productoSchema.virtual('color_stock').get(function() {
    if (this.cantidad_actual <= 5) return 'rojo';
    if (this.cantidad_actual <= 10) return 'amarillo';
    return 'verde';
});

// Asegurar que los virtuales se incluyan al convertir a JSON
productoSchema.set('toJSON', { virtuals: true });
productoSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Producto', productoSchema);
