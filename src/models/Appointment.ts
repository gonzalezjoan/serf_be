import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import db from '../config/db.ts';
import User from './User.ts'; 
import DoctorProfile from './Doctor.ts';
import Treatment from './Tratamientos.ts';

class Appointment extends Model<InferAttributes<Appointment>, InferCreationAttributes<Appointment>> {
    declare id: CreationOptional<number>;
    declare userId: number;
    declare doctorId: number;
    declare treatmentId: number;
    declare appointmentDate: Date; // Añadimos fecha obligatoria para el calendario
    declare status: 'pending' | 'approved' | 'moved'; // Estado para la lógica del doctor
}

Appointment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'DoctorProfiles', // Alineado perfectamente con la migración
            key: 'id'
        }
    },
    treatmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Treatment', // Alineado con la migración de tratamientos
            key: 'id'
        }
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'moved'),
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    sequelize: db,
    modelName: 'Appointment',
    tableName: 'Appointment', // En tu migración la creaste en singular 'Appointment'
    timestamps: true
});

// ===================================================
// RELACIONES ASOCIATIVAS (Clave para consultas complejas)
// ===================================================
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'patient' });
User.hasMany(Appointment, { foreignKey: 'userId', as: 'appointments' });

Appointment.belongsTo(DoctorProfile, { foreignKey: 'doctorId', as: 'doctor' });
DoctorProfile.hasMany(Appointment, { foreignKey: 'doctorId', as: 'appointments' });

Appointment.belongsTo(Treatment, { foreignKey: 'treatmentId', as: 'treatment' });
Treatment.hasMany(Appointment, { foreignKey: 'treatmentId', as: 'appointments' });

export default Appointment;