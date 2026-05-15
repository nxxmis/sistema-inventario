const mongoose = require('mongoose');
const Bodega = require('./models/Bodega');
const Sector = require('./models/Sector');
const Estante = require('./models/Estante');

class Database {
    async connect() {
        try {
            // Usaremos una URI por defecto para desarrollo local
            const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sistema-inventario';
            
            await mongoose.connect(uri);
            console.log('Conectado a la base de datos MongoDB exitosamente');
            
            // Insertar datos iniciales si la base de datos está vacía
            await this.insertInitialData();
            
        } catch (error) {
            console.error('Error al conectar con la base de datos MongoDB:', error);
            throw error;
        }
    }

    async insertInitialData() {
        try {
            const count = await Bodega.countDocuments();
            if (count > 0) {
                return; // Ya hay datos
            }
            
            console.log('Insertando datos iniciales...');
            
            // Crear Bodegas
            const bodega1 = await Bodega.create({ nombre: 'Bodega Principal', descripcion: 'Bodega principal del sistema' });
            const bodega2 = await Bodega.create({ nombre: 'Bodega Secundaria', descripcion: 'Bodega secundaria para productos adicionales' });
            
            // Crear Sectores para Bodega 1
            for (let i = 1; i <= 4; i++) {
                const sector = await Sector.create({
                    bodega_id: bodega1._id,
                    nombre: `Sector ${i}`,
                    descripcion: `Sector ${i} de la bodega`
                });
                
                // Crear Estantes para cada Sector
                for (let j = 1; j <= 4; j++) {
                    await Estante.create({
                        sector_id: sector._id,
                        nombre: `Estante ${j}`,
                        capacidad: 6
                    });
                }
            }
            console.log('Datos iniciales insertados exitosamente');
        } catch (error) {
            console.error('Error insertando datos iniciales:', error);
        }
    }

    async close() {
        try {
            await mongoose.disconnect();
            console.log('Conexión a la base de datos cerrada');
        } catch (error) {
            console.error('Error al cerrar la conexión:', error);
            throw error;
        }
    }
}

module.exports = new Database();
