import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import db from '../config/db.ts';

// 1. Modificamos la interfaz de TypeScript
class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
    declare id: CreationOptional<number>;
    declare roleName: string;     // <-- CAMBIO: De descriptionRole a roleName
    declare description: string;   
}

// 2. Inicializamos el modelo mapeando la columna exacta de la migración
Role.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    roleName: {                     // <-- CAMBIO: De descriptionRole a roleName
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Role',
    tableName: 'Roles' 
});

export default Role;