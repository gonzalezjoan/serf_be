import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.ts';
import DoctorProfile from '../models/Doctor.ts';
import Role from '../models/Roles.ts'; 
import { ROLE_MODULES } from '../config/modules.config.ts';

export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        // 1. Buscar al usuario e INCLUIR su Rol y su Perfil de Doctor si existe
        const user = await User.findOne({
            where: { email },
            include: [
                { model: Role, attributes: ['roleName'] }, // Traemos el nombre del rol
                { model: DoctorProfile, attributes: ['doctorCode'] } // Traemos el código si es doctor
            ]
        });

        // 2. Validación de seguridad: ¿Existe el usuario?
        if (!user) {
            return res.status(401).json({ msg: 'Credenciales incorrectas (Email no encontrado)' });
        }

        // 3. Validación de seguridad: ¿La contraseña coincide?
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: 'Credenciales incorrectas (Contraseña inválida)' });
        }

        // ==========================================
        // MODIFICACIÓN LÍNEA 43: VALIDACIÓN DEFENSIVA DEL ROL
        // ==========================================
        // Si por un error de migración o asociación el registro no trae el objeto Role adjunto, evitamos que rompa el backend
        if (!(user as any).Role || !(user as any).Role.roleName) {
            return res.status(500).json({ msg: 'Error de consistencia: El usuario no tiene un rol asignado en el sistema.' });
        }

        const roleName = (user as any).Role.roleName;

        // 5. Generar el JWT Payload incluyendo el roleName y el roleId
        const tokenPayload = {
            id: user.id,
            email: user.email,
            role: roleName,
            roleId: user.roleId
        };

        // Firmamos el token
        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'secret_word_key',
            { expiresIn: '30m' }
        );

        // 6. Obtener los módulos correspondientes a su rol desde nuestra configuración
        const allowedModules = ROLE_MODULES[roleName] || [];

        // 7. Preparar los datos del usuario para la respuesta del Frontend
        const responseUserData: any = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: roleName,
        };

        // ==========================================
        // MODIFICACIÓN LÍNEA 53: VALIDACIÓN DEL PERFIL DEL DOCTOR
        // ==========================================
        // Si el rol es 'doctor', verificamos de forma estricta que exista su perfil adjunto antes de leer su doctorCode
        if (roleName === 'doctor') {
            if ((user as any).DoctorProfile && (user as any).DoctorProfile.doctorCode) {
                responseUserData.doctorCode = (user as any).DoctorProfile.doctorCode;
            } else {
                // Alerta de seguridad o inconsistencia de datos: Es un doctor pero no tiene código en su tabla perfil
                return res.status(400).json({ 
                    msg: 'Error de perfil: El usuario está registrado como Doctor pero no posee un perfil médico asociado.' 
                });
            }
        }

        // 8. ¡Respuesta Exitosa Perfecta!
        return res.status(200).json({
            msg: 'Inicio de sesión exitoso',
            token,
            user: responseUserData,
            modules: allowedModules 
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Hubo un error en el servidor al intentar iniciar sesión'
        });
    }
};