import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Drink from './drink.model';
import StorageLocation from './storageLocation.model';

export interface StockAttributes {
    id?: number;
    drinkId: number;
    storageLocationId: number;
    quantity: number;
    createdAt?: Date;
    updatedAt?: Date;
}

class Stock extends Model<StockAttributes> implements StockAttributes {
    public id!: number;
    public drinkId!: number;
    public storageLocationId!: number;
    public quantity!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Stock.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        drinkId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'drinks',
                key: 'id'
            }
        },
        storageLocationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'storage_locations',
                key: 'id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    },
    {
        sequelize,
        modelName: 'Stock',
        tableName: 'stock'
    }
);

Drink.hasMany(Stock, { foreignKey: 'drinkId' });
Stock.belongsTo(Drink, { foreignKey: 'drinkId' });

StorageLocation.hasMany(Stock, { foreignKey: 'storageLocationId' });
Stock.belongsTo(StorageLocation, { foreignKey: 'storageLocationId' });

export default Stock;
