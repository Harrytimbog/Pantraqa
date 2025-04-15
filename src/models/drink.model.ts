import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface DrinkAttributes {
    id?: number;
    name: string;
    size: string;
    category: 'soft' | 'wine' | 'spirit' | 'beer' | 'other';
    createdAt?: Date;
    updatedAt?: Date;
}

class Drink extends Model<DrinkAttributes> implements DrinkAttributes {
    public id!: number;
    public name!: string;
    public size!: string;
    public category!: 'soft' | 'wine' | 'spirit' | 'beer' | 'other';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Drink.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        size: {
            type: DataTypes.STRING,
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM('soft', 'wine', 'spirit', 'beer', 'other'),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Drink',
        tableName: 'drinks'
    }
);

export default Drink;
