import type { Request, Response } from 'express';
import User from '../models/User.ts';
import DoctorProfile from '../models/Doctor.ts'; // Asumiendo que creaste este modelo con la relación

export const registerDoctorAccount = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, identityCard, doctorCode } = req.body;

        // 1. Validar que el email, cédula o código de doctor no existan ya
        const userExists = await User.findOne({ where: { email } });
        const idExists = await User.findOne({ where: { identityCard } });
        const codeExists = await DoctorProfile.findOne({ where: { doctorCode } });

        if (userExists || idExists || codeExists) {
            return res.status(409).json({ 
                msg: 'El email, la cédula o el código de doctor ya se encuentran registrados' 
            });
        }

        // 2. PASO 1: Crear el Usuario en la tabla 'Users' con rol de doctor
        // Forzamos el rol a 'doctor' por seguridad, ignorando lo que envíe el cliente
        const newUser = await User.create({
            ...req.body,
            roleId: '2' 
        });

        // 3. PASO 2: Crear el perfil en la tabla 'DoctorProfiles' usando el ID del usuario creado arriba
        await DoctorProfile.create({
            doctorCode,
            userId: newUser.id // Aquí se hace el puente físico entre ambas tablas
        });

        return res.status(201).json({
            msg: "Doctor registrado exitosamente en el sistema",
            data: {
                id: newUser.id,
                firstName: newUser.firstName,
                email: newUser.email,
                doctorCode
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Hubo un error al intentar registrar el Doctor'
        });
    }
};

export default registerDoctorAccount;