import type { Request, Response } from 'express';
import User from '../models/User.ts'; // Importamos el modelo

export const registerAccount = async (req: Request, res: Response) => {
    try {
        // 1. Extraer los datos del cuerpo de la petición
        const { email, identityCard } = req.body;

        // 2. Validación de Negocio: Revisar si el usuario ya existe
        // Usamos findOne para buscar por email o cédula
        const userExists = await User.findOne({ where: { email } });
        const idExists = await User.findOne({ where: { identityCard } });

        if (userExists || idExists) {
            return res.status(409).json({ 
                msg: 'El usuario ya está registrado con ese email o cédula' 
            });
        }

        // 3. Crear el usuario en la base de datos
        // .create() es un método de Sequelize que hace el INSERT INTO automático
        const user = await User.create(req.body);

        // 4. Respuesta de éxito
        return res.status(201).json({
            msg: "Usuario creado exitosamente",
            data: {
                id: user.id,
                email: user.email,
                firstName: user.firstName
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Hubo un error al intentar registrar el usuario'
        });
    }
};