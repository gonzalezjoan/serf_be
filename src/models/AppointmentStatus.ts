import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import db from '../config/db.ts';

class AppointmentStatus extends Model<InferAttributes<AppointmentStatus>, InferCreationAttributes<AppointmentStatus>> {
    declare id: CreationOptional<number>;
    declare statusName: string;
}

AppointmentStatus.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    statusName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize: db,
    modelName: 'AppointmentStatus',
    tableName: 'AppointmentStatus',
    timestamps: true
});

export default AppointmentStatus;