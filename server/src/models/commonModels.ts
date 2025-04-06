import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../config/db"; // Adjust according to your file structure

// Define the attributes of the User model
interface UserAttributes {
  email: string;
  password: string;
  username: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
  public email!: string;
  public password!: string;
  public username!: string;

  // Add password hashing method here if needed
}

// Define the User model with Sequelize
User.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize, // The connection instance
    modelName: "User", // The name of the model
  }
);

// Before creating or updating a user, hash the password
User.beforeCreate(async (user) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});
export const PostOffice = sequelize.define("PostOffice", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
    validate: {
      is: /^[0-9]{5}$/,
    },
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export const Shipment = sequelize.define("Shipment", {
  shipmentNumber: {
    type: DataTypes.STRING,
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
    type: DataTypes.ENUM,
    values: [
      "Received and processed in the parcel centre of origin",
      "Received and processed in the destination parcel centre",
      "Delivered",
    ],
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM,
    values: ["Letter", "Package"],
    allowNull: false,
  },
  weightCategory: {
    type: DataTypes.ENUM,
    values: ["Less than 1kg", "Between 1kg and 5kg", "More than 5kg"],
    allowNull: false,
  },
  actualWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  originZipCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: PostOffice,
      key: "zipCode",
    },
  },
  destinationZipCode: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: PostOffice,
      key: "zipCode",
    },
  },
});

PostOffice.hasMany(Shipment, {
  foreignKey: "originZipCode",
  sourceKey: "zipCode",
  as: "outgoingShipments",
  onDelete: "CASCADE",
});

PostOffice.hasMany(Shipment, {
  foreignKey: "destinationZipCode",
  sourceKey: "zipCode",
  as: "incomingShipments",
  onDelete: "CASCADE",
});

Shipment.belongsTo(PostOffice, {
  foreignKey: "originZipCode",
  targetKey: "zipCode",
  as: "originPostOffice",
  onDelete: "CASCADE",
});

Shipment.belongsTo(PostOffice, {
  foreignKey: "destinationZipCode",
  targetKey: "zipCode",
  as: "destinationPostOffice",
  onDelete: "CASCADE",
});

// Sync the User table to create it in the database
User.sync();
PostOffice.sync();
Shipment.sync();