import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import db from '../config/db.ts';
import User from './User.ts'; 
import DoctorProfile from './Doctor.ts';
import Treatment from './Tratamientos.ts';
import AppointmentStatus from './AppointmentStatus.ts';

class Appointment extends Model<InferAttributes<Appointment>, InferCreationAttributes<Appointment>> {
    declare id: CreationOptional<number>;
    declare userId: number;
    declare doctorId: number;
    declare treatmentId: number;
    declare appointmentDate: Date;
    declare statusId: number;
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
        references: { model: 'Users', key: 'id' }
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'DoctorProfiles', key: 'id' }
    },
    treatmentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Treatment', key: 'id' }
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize: db,
    modelName: 'Appointment',
    tableName: 'Appointment',
    timestamps: true
});

// ===================================================
// RELACIONES ASOCIATIVAS LIMPIAS Y UNIFICADAS
// ===================================================
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'patient' });
Appointment.belongsTo(DoctorProfile, { foreignKey: 'doctorId', as: 'doctor' });
Appointment.belongsTo(Treatment, { foreignKey: 'treatmentId', as: 'treatment' });

// Asociación blindada para el arranque
Appointment.belongsTo(AppointmentStatus, { foreignKey: 'statusId', as: 'currentStatus', constraints: false });
AppointmentStatus.hasMany(Appointment, { foreignKey: 'statusId', as: 'appointments', constraints: false });

export default Appointment;