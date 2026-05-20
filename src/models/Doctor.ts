import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import db from '../config/db.ts';
import User from './User.ts'; // Importamos el modelo de Usuarios
import Role from './Roles.ts'; // <--- NUEVA IMPORTACIÓN: Traemos el modelo de Roles

class DoctorProfile extends Model<InferAttributes<DoctorProfile>, InferCreationAttributes<DoctorProfile>> {
    declare id: CreationOptional<number>;
    declare doctorCode: number;
    declare userId: number; 
}

DoctorProfile.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    doctorCode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    }
}, {
    sequelize: db,
    modelName: 'DoctorProfile',
    tableName: 'DoctorProfiles' // Forzamos el plural exacto de la migración
});

// ====================================================
// RELACIONES DEL SISTEMA (EL CONTRATO ENTRE TABLAS)
// ====================================================

// 1. Relación Doctor <-> User (Ya la tenías hecha y funciona excelente)
DoctorProfile.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(DoctorProfile, { foreignKey: 'userId' });

// 2. NUEVA RELACIÓN: User <-> Role (¡El eslabón perdido!)
// Le explicamos a Sequelize que un Usuario pertenece a un Rol mediante 'roleId'
User.belongsTo(Role, { foreignKey: 'roleId' });

// Opcional pero recomendado: Un Rol tiene muchos Usuarios
Role.hasMany(User, { foreignKey: 'roleId' });

export default DoctorProfile;