import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import db from '../config/db.ts';
import { hashPassword } from '../handlers/password_hash.ts';

// Al extender Model, usamos estos "Generics" <...> para decirle a TS qué campos esperar
class Doctor extends Model<InferAttributes<Doctor>, InferCreationAttributes<Doctor>> {
    // Declaramos las propiedades para que TypeScript las conozca
    declare id: CreationOptional<number>; // CreationOptional indica que es autoincremental (opcional al crear)
    declare firstName: string;
    declare lastName: string;
    declare email: string;
    declare phone: string;
    declare identityCard: string;
    declare doctorCode: number;
    declare password: string;
    declare role: string;
}

Doctor.init({
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
    doctorCode: {
        primaryKey: true,
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'doctor'
    },
}, {
    sequelize: db,
    modelName: 'Doctor',
    hooks: {
        // Se ejecuta automáticamente antes de guardar en la DB
        beforeCreate: async (doctor: Doctor) => {
            if (doctor.password) {
                doctor.password = await hashPassword(doctor.password);
            }
        },
        // Se ejecuta si el usuario decide actualizar su contraseña después
        beforeUpdate: async (doctor: Doctor) => {
            if (doctor.changed('password')) {
                doctor.password = await hashPassword(doctor.password);
            }
        }
    }
});

export default Doctor;