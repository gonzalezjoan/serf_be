import { Router } from 'express';
import { check } from 'express-validator';
import { registerAccount } from '../controllers/register.controller.ts';
import handleInputErrors from '../handlers/validation.ts';
import { login } from '../controllers/login.controller.ts';
import { authenticateToken } from '../middlewares/auth.middleware.ts';
import validateDataProfile from '../handlers/validateDataProfile.ts';
import registerDoctorAccount from '../controllers/registerDoctor.controller.ts';
import { allowRoles } from '../middlewares/roles.middleware.ts';
import { createTreatment, createInventary } from '../controllers/treatmentAndInventary.controller.ts';
import { createNewAppointment, handleAppointmentEndpoint, updateAppointmentStatus, } from '../controllers/appointment.controller.ts';

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
    authenticateToken, 
    allowRoles('sysadmin'), 
    // Validaciones para la tabla Users
    check('firstName').notEmpty().withMessage('El nombre es obligatorio'),
    check('lastName').notEmpty().withMessage('El apellido es obligatorio'),
    check('email').isEmail().withMessage('El formato del correo es inválido'),
    check('phone').isMobilePhone('any').withMessage('El número de teléfono no es válido'),
    check('identityCard').notEmpty().withMessage('La cédula es obligatoria'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria'),
    
    // ¡AQUÍ ESTÁ EL CAMBIO!: Agregamos la validación del campo exclusivo de los doctores
    check('doctorCode')
        .notEmpty().withMessage('El código de doctor es obligatorio')
        .isInt().withMessage('El código de doctor debe ser un número entero'),
        
    handleInputErrors,
    registerDoctorAccount
);

router.post('/createTreatment',
    authenticateToken,
    allowRoles('sysadmin'),
    createTreatment
);

router.post('/createIventary',
    authenticateToken,
    allowRoles('sysadmin'),
    createInventary
);

router.post('/createAppointment',
    authenticateToken,
    allowRoles('sysadmin', 'doctor', 'patient'),
    createNewAppointment
);

// RUTA PARA CONSULTAR DISPONIBILIDAD / VER CITAS (GET)
router.get('/reviewAppointment',
    authenticateToken,
    allowRoles('sysadmin', 'doctor', 'patient'),
    handleAppointmentEndpoint
);

router.put('/updateAppointmentStatus',
    authenticateToken,
    allowRoles('doctor'),
    updateAppointmentStatus
);
export default router;