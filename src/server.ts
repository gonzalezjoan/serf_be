import express from "express";
import router from "./routes/router.ts";

const app = express()

// Leer datos de formularios o JSON (Middlewares)
app.use(express.json());

// Acoplar el router
// Puedes ponerle un prefijo, por ejemplo '/api'
app.use('/api', router);

export default app;