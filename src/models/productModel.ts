import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "products",
})
export class Products extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  price!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  countInStock!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 5
  })
  rating!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  discount!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0
  })
  selled!: number;
}


