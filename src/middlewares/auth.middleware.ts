import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ msg: 'Acceso denegado. No se proporcionó un token.' });
        return; // IMPORTANTE: Agregamos el return para cerrar este camino
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ msg: 'Error de configuración en el servidor' });
            return;
        }

        const decoded = jwt.verify(token, secret);
        (req as any).user = decoded;
        
        next(); // Si todo sale bien, pasamos al siguiente
    } catch (error) {
        res.status(403).json({ msg: 'Token inválido o expirado.' });
        return; // IMPORTANTE: Agregamos el return aquí también
    }
};