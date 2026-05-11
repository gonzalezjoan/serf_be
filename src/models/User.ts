import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import db from '../config/db.ts';

// Al extender Model, usamos estos "Generics" <...> para decirle a TS qué campos esperar
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    // Declaramos las propiedades para que TypeScript las conozca
    declare id: CreationOptional<number>; // CreationOptional indica que es autoincremental (opcional al crear)
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare phone: string;
    declare identityCard: string;
    declare acceptTerms: boolean;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true 
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    identityCard: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    acceptTerms: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'User'
});

export default User;