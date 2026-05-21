import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import db from '../config/db.ts';

// 1. Modificamos la interfaz de TypeScript
class Treatment extends Model<InferAttributes<Treatment>, InferCreationAttributes<Treatment>> {
    declare id: CreationOptional<number>;
    declare treatmentsName: string;
    declare treatmentsDescription: string;
    declare treatmentsCost: number;
}

// 2. Inicializamos el modelo mapeando la columna exacta de la migración
Treatment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    treatmentsName: {                    
        type: DataTypes.STRING,
        allowNull: false
    },
    treatmentsDescription: {
        type: DataTypes.STRING,
        allowNull: false
    },
    treatmentsCost:{
        type:DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: db,
    modelName: 'Treatment',
    tableName: 'Treatments' 
});

export default Treatment;