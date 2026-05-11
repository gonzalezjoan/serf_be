import colors from 'colors';
import app from "./server.ts";
import db from './config/db.ts';
//import type { Request, Response, Application } from 'express';

//const app: Application = express();
const PORT = process.env.API_PORT || 4000;

async function connectDB() {
    try {
        await db.authenticate(); // Prueba la conexión
        await db.sync();         // Crea las tablas basadas en tus modelos
        console.log(colors.blue.bold('Conexión a la base de datos exitosa'));
    } catch (error) {
        console.log(colors.red.bold('Error al conectar a la BD:'), error);
    }
}

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(colors.bgWhite.cyan.bold.italic(`Servidor corriendo en http://localhost:${PORT}`));
    });
});