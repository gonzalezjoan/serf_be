import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import db from '../config/db.ts';
import { hashPassword } from '../handlers/password_hash.ts';

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
    declare password: string;
    declare roleId: number; // Este campo es la FK que apunta a Roles
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
    password: {
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
    },
    roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 3, // ID por defecto de 'patient'
    references: {
        model: 'Roles',
        key: 'id'
    }
}
}, {
    sequelize: db,
    modelName: 'User',
    hooks: {
        // Se ejecuta automáticamente antes de guardar en la DB
        beforeCreate: async (user: User) => {
            if (user.password) {
                user.password = await hashPassword(user.password);
            }
        },
        // Se ejecuta si el usuario decide actualizar su contraseña después
        beforeUpdate: async (user: User) => {
            if (user.changed('password')) {
                user.password = await hashPassword(user.password);
            }
        }
    }
});

export default User;