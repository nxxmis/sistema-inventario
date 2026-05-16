# 📦 Sistema de Gestión de Almacén (Inventario)

Este es un sistema de gestión de inventarios desarrollado utilizando arquitectura **MVC** con **Node.js, Express, EJS y MongoDB**. 

El sistema permite la administración completa de un almacén, con ubicaciones jerárquicas (Bodegas > Sectores > Estantes), alertas de stock bajo y una interfaz visual e intuitiva.

## 🚀 Características Principales
*   **Gestión de Stock:** Creación, edición, listado y eliminación de productos.
*   **Control Rápido:** Botones de `[+]` y `[-]` para ajustar el stock de manera instantánea.
*   **Semáforo Visual de Alertas:**
    *   🟢 **Verde:** Más de 10 unidades en stock.
    *   🟡 **Amarillo:** Entre 6 y 10 unidades.
    *   🔴 **Rojo:** 5 unidades o menos.
*   **Filtro de Alertas:** Panel especial que lista únicamente los productos que requieren atención urgente (Stock amarillo o rojo).

## 🛠️ Tecnologías Utilizadas
*   **Backend:** Node.js, Express.
*   **Frontend:** EJS (Embedded JavaScript templating), HTML5, CSS3 Vanilla.
*   **Base de Datos:** MongoDB y Mongoose (ODM).

---

## ⚙️ Instrucciones de Instalación

Sigue estos pasos para ejecutar el proyecto en tu computadora local.

### 1. Requisitos Previos
Asegúrate de tener instalados en tu sistema:
*   [Node.js](https://nodejs.org/) (Versión 18 o superior recomendada).
*   [MongoDB](https://www.mongodb.com/try/download/community) ejecutándose localmente en el puerto `27017` (opción predeterminada).

### 2. Clonar el Repositorio
Abre tu terminal y clona este proyecto:
```bash
git clone https://github.com/nxxmis/sistema-inventario.git
cd sistema-inventario
```

### 3. Instalar Dependencias
Instala todos los paquetes necesarios de Node.js ejecutando:
```bash
npm install
```

### 4. Configurar la Base de Datos
El proyecto está configurado para conectarse automáticamente a una base de datos local llamada `sistema-inventario` en `mongodb://127.0.0.1:27017/sistema-inventario`. 

No es necesario crear las colecciones manualmente. **El sistema "sembrará" ubicaciones por defecto** (Bodegas, Sectores y Estantes de prueba) automáticamente la primera vez que inicies el servidor si la base de datos está vacía.

### 5. Iniciar el Servidor
Para arrancar la aplicación, ejecuta:
```bash
npm start
```
*(Nota: Si deseas correrlo en modo de desarrollo con reinicio automático, puedes usar `npm run dev` si tienes `nodemon` instalado globalmente).*

### 6. Usar la Aplicación
Abre tu navegador web favorito y accede a:
[http://localhost:3000](http://localhost:3000)
