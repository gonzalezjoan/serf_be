import { Sequelize } from 'sequelize';

// Sustituye 'tu_usuario', 'tu_password' y 'nombre_db' con tus datos reales de Postgres
const db = new Sequelize('test_be', 'test_be', 't3$t_B3', {
    host: 'localhost',
    port: 5435, // Tu puerto personalizado
    dialect: 'postgres',
    logging: false, // Evita llenar la consola con logs de SQL (opcional)
});

export default db;