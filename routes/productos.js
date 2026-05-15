const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Estante = require('../models/Estante');
const Sector = require('../models/Sector');
const Bodega = require('../models/Bodega');

// GET /productos - Mostrar lista de productos
router.get('/', async (req, res) => {
    try {
        // Obtenemos los productos y poblamos para mostrar la ubicación
        const productosDb = await Producto.find().populate({
            path: 'estante_id',
            populate: {
                path: 'sector_id',
                populate: {
                    path: 'bodega_id'
                }
            }
        }).sort({ createdAt: -1 });

        // Formatear los datos para la vista lista.ejs
        const productos = productosDb.map(p => ({
            id: p._id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            cantidad_inicial: p.cantidad_inicial,
            cantidad_actual: p.cantidad_actual,
            color_stock: p.color_stock,
            precio: p.precio,
            nombre_estante: p.estante_id ? p.estante_id.nombre : 'N/A',
            nombre_sector: p.estante_id && p.estante_id.sector_id ? p.estante_id.sector_id.nombre : 'N/A',
            nombre_bodega: p.estante_id && p.estante_id.sector_id && p.estante_id.sector_id.bodega_id ? p.estante_id.sector_id.bodega_id.nombre : 'N/A'
        }));

        res.render('productos/lista', { productos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos: ' + error.message + '<br><pre>' + error.stack + '</pre>');
    }
});

// GET /productos/alertas - Mostrar productos con bajo stock
router.get('/alertas', async (req, res) => {
    try {
        const productosDb = await Producto.find().populate({
            path: 'estante_id',
            populate: {
                path: 'sector_id',
                populate: { path: 'bodega_id' }
            }
        }).sort({ createdAt: -1 });

        const productos = productosDb
            .filter(p => p.cantidad_actual <= 10)
            .map(p => ({
                id: p._id,
                nombre: p.nombre,
                descripcion: p.descripcion,
                cantidad_inicial: p.cantidad_inicial,
                cantidad_actual: p.cantidad_actual,
                color_stock: p.color_stock,
                precio: p.precio,
                nombre_estante: p.estante_id ? p.estante_id.nombre : 'N/A',
                nombre_sector: p.estante_id && p.estante_id.sector_id ? p.estante_id.sector_id.nombre : 'N/A',
                nombre_bodega: p.estante_id && p.estante_id.sector_id && p.estante_id.sector_id.bodega_id ? p.estante_id.sector_id.bodega_id.nombre : 'N/A'
            }));

        res.render('productos/lista', { productos, isAlerts: true });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener alertas');
    }
});

// GET /productos/nuevo - Mostrar formulario para nuevo producto
router.get('/nuevo', async (req, res) => {
    try {
        const estantesDb = await Estante.find().populate({
            path: 'sector_id',
            populate: { path: 'bodega_id' }
        });
        
        const estantes = estantesDb.map(e => ({
            id: e._id,
            nombre: e.nombre,
            nombre_sector: e.sector_id ? e.sector_id.nombre : 'N/A',
            nombre_bodega: e.sector_id && e.sector_id.bodega_id ? e.sector_id.bodega_id.nombre : 'N/A'
        }));

        res.render('productos/nuevo', { estantes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar formulario');
    }
});

// POST /productos - Crear el nuevo producto
router.post('/', async (req, res) => {
    try {
        const { nombre, descripcion, estante_id, cantidad_inicial, precio } = req.body;
        
        const nuevoProducto = new Producto({
            nombre,
            descripcion,
            estante_id,
            cantidad_inicial: Math.max(0, parseInt(cantidad_inicial) || 0),
            cantidad_actual: Math.max(0, parseInt(cantidad_inicial) || 0),
            precio: parseFloat(precio) || 0
        });

        await nuevoProducto.save();
        res.redirect('/productos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear producto');
    }
});

// GET /productos/editar/:id - Mostrar formulario de edición
router.get('/editar/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (!producto) {
            return res.status(404).send('Producto no encontrado');
        }
        
        const estantesDb = await Estante.find().populate({
            path: 'sector_id',
            populate: { path: 'bodega_id' }
        });
        
        const estantes = estantesDb.map(e => ({
            id: e._id,
            nombre: e.nombre,
            nombre_sector: e.sector_id ? e.sector_id.nombre : 'N/A',
            nombre_bodega: e.sector_id && e.sector_id.bodega_id ? e.sector_id.bodega_id.nombre : 'N/A'
        }));

        res.render('productos/editar', { producto, estantes });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar producto');
    }
});

// PUT /productos/:id - Actualizar producto
router.put('/:id', async (req, res) => {
    try {
        const { nombre, descripcion, estante_id, cantidad_actual, precio } = req.body;
        
        await Producto.findByIdAndUpdate(req.params.id, {
            nombre,
            descripcion,
            estante_id,
            cantidad_actual: Math.max(0, parseInt(cantidad_actual) || 0),
            precio: parseFloat(precio) || 0
        });

        res.redirect('/productos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar producto');
    }
});

// POST /productos/:id/sumar - Sumar stock
router.post('/:id/sumar', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (producto) {
            producto.cantidad_actual += 1;
            await producto.save();
        }
        res.redirect('/productos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al sumar stock');
    }
});

// POST /productos/:id/restar - Restar stock
router.post('/:id/restar', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        if (producto && producto.cantidad_actual > 0) {
            producto.cantidad_actual -= 1;
            await producto.save();
        }
        res.redirect('/productos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al restar stock');
    }
});

// POST /productos/:id/eliminar - Eliminar producto
router.post('/:id/eliminar', async (req, res) => {
    try {
        await Producto.findByIdAndDelete(req.params.id);
        res.redirect('/productos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al eliminar producto');
    }
});

module.exports = router;
