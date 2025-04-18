import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
    id?: number;
    email: string;
    name: string;
    password: string;
    role?: 'staff' | 'manager' | 'admin';
    createdAt?: Date;
    updatedAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public name!: string;
    public password!: string;
    public role!: 'staff' | 'manager' | 'admin';
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notEmpty: true }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('staff', 'manager', 'admin'),
            defaultValue: 'staff'
        }
    },
    {
        sequelize,
        modelName: 'User',
        tableName: 'users'
    }
);

export default User;
