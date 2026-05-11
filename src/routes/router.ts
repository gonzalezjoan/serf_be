import { Router } from 'express';
import { check } from 'express-validator';
import { registerAccount } from '../controllers/register.controller.ts';
import handleInputErrors from '../handlers/validation.ts';

const router = Router();



router.post('/auth/register', 
    // 1. Validaciones
    check('email').isEmail().withMessage('El formato del correo es inválido'),
    check('phone').isMobilePhone('any').withMessage('El número de teléfono no es válido'),
    check('identityCard').notEmpty().withMessage('La cédula es obligatoria'),
    check('acceptTerms').equals('true').withMessage('Debes aceptar los términos y condiciones'),
    // 2. Manejador de errores
    handleInputErrors,
    // 3. Controlador final
    registerAccount
);

export default router;