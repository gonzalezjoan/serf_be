import type { Request, Response, NextFunction } from 'express';

export const allowRoles = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        // 1. Verificar que el middleware anterior (authenticateToken) haya guardado al usuario
        const user = (req as any).user;
        
        if (!user) {
            res.status(401).json({ msg: 'No autorizado. Inicie sesión primero.' });
            return;
        }

        // 2. Verificar si el rol del usuario está dentro de los roles permitidos para esta ruta
        // Si allowedRoles es ['sysadmin'], y el usuario es 'patient', esto dará false
        if (!allowedRoles.includes(user.role)) {
            res.status(403).json({ 
                msg: `Acceso denegado. Tu rol (${user.role}) no tiene permisos para esta acción.` 
            });
            return;
        }

        // 3. Si tiene el rol adecuado, permitimos continuar al controlador
        next();
    };
};