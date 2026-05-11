import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

const handleInputErrors = (req: Request, res: Response, next: NextFunction) => {
    // 1. validationResult(req) recolecta todos los errores que 'check' encontró.
    const errors = validationResult(req);
    
    // 2. Si hay errores, respondemos inmediatamente y cortamos el flujo.
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return; // Detiene la ejecución
    }
    
    // 3. Si todo está bien, 'next()' le dice a Express: "Pasa a la siguiente función".
    next();
};

export default handleInputErrors;