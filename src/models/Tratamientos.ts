import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import db from '../config/db.ts';

class Treatment extends Model<InferAttributes<Treatment>, InferCreationAttributes<Treatment>> {
    declare id: CreationOptional<number>;
    declare treatmentName: string;
    declare treatmentDescription: string;
    declare treatmentCost: number;
}

Treatment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    treatmentName: {                    
        type: DataTypes.STRING,
        allowNull: false
    },
    treatmentDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    treatmentCost: {
        type: DataTypes.DECIMAL(10, 2), // Usamos DECIMAL para costos monetarios
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Treatment',
    tableName: 'Treatment', // Vinculado a la tabla de la migración
    timestamps: true
});

export default Treatment;