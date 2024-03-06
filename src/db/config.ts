import { Sequelize } from "sequelize-typescript";
import { Users } from "../models/userModel";
import { Products } from "../models/productModel";
import { OrderItems } from "../models/orderItemModel";
import { ShippingAddresses } from "../models/shippingAddressModel";
import { Orders } from "../models/orderModel";
import { Types } from "../models/typeModel";
import { ProductImages } from "../models/productImageModel";

const connection = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "hiep",
  database: "ecommerce",
  logging: false,
  models: [Users, Products, OrderItems, ShippingAddresses, Orders, Types, ProductImages],
});

export default connection;
