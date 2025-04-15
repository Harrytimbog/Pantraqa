import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface StorageLocationAttributes {
    id?: number;
    name: string;
    type: 'pantry' | 'cage';
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

class StorageLocation extends Model<StorageLocationAttributes> implements StorageLocationAttributes {
    public id!: number;
    public name!: string;
    public type!: 'pantry' | 'cage';
    public description?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

StorageLocation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('pantry', 'cage'),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'StorageLocation',
        tableName: 'storage_locations'
    }
);

export default StorageLocation;
