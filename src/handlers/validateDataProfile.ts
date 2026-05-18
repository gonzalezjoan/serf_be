import User from "../models/User.ts";

const validateDataProfile = async (req: any, res: any): Promise<any> => {
        try {
            // 1. Buscamos al usuario en la DB usando el ID que viene en el token (req.user.id)
            const user = await User.findByPk(req.user.id, {
                // EXCLUIMOS la contraseña por seguridad, pero traemos todo lo demás
                attributes: { exclude: ['password'] } 
            });

            // 2. Si por alguna razón el usuario ya no existe en la DB
            if (!user) {
                return res.status(404).json({ msg: 'Usuario no encontrado' });
            }

            // 3. Enviamos los datos REALES de la base de datos
            return res.json({
                msg: 'Datos obtenidos de forma segura',
                user: user // Aquí ya vendrá firstName, lastName, phone, etc.
            });

        } catch (error) {
            return res.status(500).json({
                msg: 'Error al conectar con la base de datos',
                error
            });
        }
    }

export default validateDataProfile;