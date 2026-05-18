import { type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.ts';
import { comparePassword } from '../handlers/password_hash.ts';

// 1. Agregamos el tipo de retorno : Promise<any> o Promise<Response>
export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // 2. Buscamos al usuario
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // 3. Comparamos la contraseña usando tu nuevo handler
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // 4. Resolvemos el error 2412 y 2769: validamos el secreto
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            // Esto lanza un error al catch si no configuraste el .env
            throw new Error('JWT_SECRET no está definido en las variables de entorno');
        }

        // 5. Generamos el token con el secreto validado
        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret, 
            { expiresIn: '15m' }
        );

        // Retorno final de éxito
        return res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        // Aseguramos que el catch también retorne un valor (Resuelve error 7030)
        return res.status(500).json({ 
            message: 'Error en el servidor',
            error: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};