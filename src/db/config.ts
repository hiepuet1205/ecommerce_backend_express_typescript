import { Sequelize } from "sequelize-typescript";
import { Users } from "../models/userModel";
import { Products } from "../models/productModel";

const connection = new Sequelize({
  dialect: "mysql",
  host: "localhost",
  username: "root",
  password: "hiep",
  database: "ecommerce",
  logging: false,
  models: [Users, Products],
});

export default connection;
