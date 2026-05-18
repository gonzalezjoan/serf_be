import bcrypt from 'bcrypt';

/**
 * Encripta una contraseña usando un salt de 10 rondas.
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * Compara una contraseña en texto plano con un hash de la base de datos.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};
