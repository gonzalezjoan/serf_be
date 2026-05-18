import { Router } from 'express';
import { check } from 'express-validator';
import { registerAccount } from '../controllers/register.controller.ts';
import handleInputErrors from '../handlers/validation.ts';
import { login } from '../controllers/login.controller.ts';
import { authenticateToken } from '../middlewares/auth.middleware.ts';
import validateDataProfile from '../handlers/validateDataProfile.ts';
import registerDoctorAccount from '../controllers/registerDoctor.controller.ts';

const router = Router();



router.post('/auth/register', 
    // 1. Validaciones
    check('firstName').notEmpty().withMessage('El nombre es obligatorio'),
    check('lastName').notEmpty().withMessage('El apellido es obligatorio'),
    check('email').isEmail().withMessage('El formato del correo es inválido'),
    check('phone').isMobilePhone('any').withMessage('El número de teléfono no es válido'),
    check('identityCard').notEmpty().withMessage('La cédula es obligatoria'),
    check('acceptTerms').equals('true').withMessage('Debes aceptar los términos y condiciones'),
    // 2. Manejador de errores
    handleInputErrors,
    // 3. Controlador final
    registerAccount
);
router.post('/auth/login', 
    // 1. Validaciones
    check('email').isEmail().withMessage('El formato del correo es inválido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    // 2. Manejador de errores
    handleInputErrors,
    // 3. Controlador final
    login
);

router.get('/profile', 
    authenticateToken, // Primero verificamos el token
    validateDataProfile // Luego obtenemos los datos reales del perfil desde la DB
);

router.post('/registerDoctor', 
    // 1. Validaciones
    check('firstName').notEmpty().withMessage('El nombre es obligatorio'),
    check('lastName').notEmpty().withMessage('El apellido es obligatorio'),
    check('email').isEmail().withMessage('El formato del correo es inválido'),
    check('phone').isMobilePhone('any').withMessage('El número de teléfono no es válido'),
    check('identityCard').notEmpty().withMessage('La cédula es obligatoria'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    // 2. Manejador de errores
    handleInputErrors,
    // 3. Controlador final
    registerDoctorAccount
);

export default router;