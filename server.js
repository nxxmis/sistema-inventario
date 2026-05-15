// Polyfill para Node 18 y Mongoose/MongoDB Driver
if (!global.crypto) {
    global.crypto = require('crypto').webcrypto;
}
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const methodOverride = require('method-override');
const path = require('path');
const database = require('./database');

// Importar rutas
const productosRoutes = require('./routes/productos');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar EJS y vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Rutas principales (Web)
app.use('/productos', productosRoutes);

// Ruta de bienvenida (Inicio)
app.get('/', (req, res) => {
    res.render('index');
});

// Manejo de errores generales
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Iniciar servidor
async function startServer() {
    try {
        // Conectar a la base de datos MongoDB
        await database.connect();
        
        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
            console.log(`Aplicación web disponible en: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();
