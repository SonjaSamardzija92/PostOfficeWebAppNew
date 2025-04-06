"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shipment = exports.PostOffice = exports.User = void 0;
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db"); // Adjust according to your file structure
class User extends sequelize_1.Model {
}
exports.User = User;
// Define the User model with Sequelize
User.init({
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize: db_1.sequelize, // The connection instance
    modelName: "User", // The name of the model
});
// Before creating or updating a user, hash the password
User.beforeCreate(async (user) => {
    const hashedPassword = await bcryptjs_1.default.hash(user.password, 10);
    user.password = hashedPassword;
});
User.beforeUpdate(async (user) => {
    if (user.changed("password")) {
        const hashedPassword = await bcryptjs_1.default.hash(user.password, 10);
        user.password = hashedPassword;
    }
});
exports.PostOffice = db_1.sequelize.define("PostOffice", {
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    zipCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        validate: {
            is: /^[0-9]{5}$/,
        },
    },
    address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
});
exports.Shipment = db_1.sequelize.define("Shipment", {
    shipmentNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: () => {
            const prefix = "SHIP";
            const random = Math.floor(Math.random() * 1000000)
                .toString()
                .padStart(6, "0");
            return `${prefix}${random}`;
        },
    },
    status: {
        type: sequelize_1.DataTypes.ENUM,
        values: [
            "Received and processed in the parcel centre of origin",
            "Received and processed in the destination parcel centre",
            "Delivered",
        ],
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["Letter", "Package"],
        allowNull: false,
    },
    weightCategory: {
        type: sequelize_1.DataTypes.ENUM,
        values: ["Less than 1kg", "Between 1kg and 5kg", "More than 5kg"],
        allowNull: false,
    },
    actualWeight: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    originZipCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: exports.PostOffice,
            key: "zipCode",
        },
    },
    destinationZipCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: exports.PostOffice,
            key: "zipCode",
        },
    },
});
exports.PostOffice.hasMany(exports.Shipment, {
    foreignKey: "originZipCode",
    sourceKey: "zipCode",
    as: "outgoingShipments",
    onDelete: "CASCADE",
});
exports.PostOffice.hasMany(exports.Shipment, {
    foreignKey: "destinationZipCode",
    sourceKey: "zipCode",
    as: "incomingShipments",
    onDelete: "CASCADE",
});
exports.Shipment.belongsTo(exports.PostOffice, {
    foreignKey: "originZipCode",
    targetKey: "zipCode",
    as: "originPostOffice",
    onDelete: "CASCADE",
});
exports.Shipment.belongsTo(exports.PostOffice, {
    foreignKey: "destinationZipCode",
    targetKey: "zipCode",
    as: "destinationPostOffice",
    onDelete: "CASCADE",
});
// Sync the User table to create it in the database
User.sync();
exports.PostOffice.sync();
exports.Shipment.sync();
