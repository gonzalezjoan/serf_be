import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional, type DecimalDataType } from "sequelize";
import db from "../config/db.ts";

class Inventary extends Model<InferAttributes<Inventary>, InferCreationAttributes<Inventary>> {
    declare id: CreationOptional<number>;
    declare itemName: string;
    declare itemUseDescription: string;
    declare itemCost: DecimalDataType;
    declare itemQuantity: number;
}

Inventary.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    itemName:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    itemUseDescription:{
        type: DataTypes.STRING,
        allowNull: true
    },
    itemCost:{
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    itemQuantity:{
        type: DataTypes.INTEGER,
        allowNull:false
    },
},{
sequelize: db,
modelName: 'Inventary',
tableName: 'Inventary'
});

export default Inventary;