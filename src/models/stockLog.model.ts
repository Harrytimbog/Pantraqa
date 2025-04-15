import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Drink from './drink.model';
import StorageLocation from './storageLocation.model';
import User from './user.model';

export interface StockLogAttributes {
    id?: number;
    userId: number;
    drinkId: number;
    storageLocationId: number;
    quantity: number;
    action: 'in' | 'out';
    createdAt?: Date;

    User?: User;
    Drink?: Drink;
    StorageLocation?: StorageLocation;
}

class StockLog extends Model<StockLogAttributes> implements StockLogAttributes {
    public id!: number;
    public userId!: number;
    public drinkId!: number;
    public storageLocationId!: number;
    public quantity!: number;
    public action!: 'in' | 'out';
    public readonly createdAt!: Date;

    public User?: User;
    public Drink?: Drink;
    public StorageLocation?: StorageLocation;
}

StockLog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' }
        },
        drinkId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'drinks', key: 'id' }
        },
        storageLocationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'storage_locations', key: 'id' }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        action: {
            type: DataTypes.ENUM('in', 'out'),
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'StockLog',
        tableName: 'stock_logs',
        timestamps: true,
        updatedAt: false
    }
);

// Relationships
User.hasMany(StockLog, { foreignKey: 'userId' });
StockLog.belongsTo(User, { foreignKey: 'userId' });

Drink.hasMany(StockLog, { foreignKey: 'drinkId' });
StockLog.belongsTo(Drink, { foreignKey: 'drinkId' });

StorageLocation.hasMany(StockLog, { foreignKey: 'storageLocationId' });
StockLog.belongsTo(StorageLocation, { foreignKey: 'storageLocationId' });

export default StockLog;
