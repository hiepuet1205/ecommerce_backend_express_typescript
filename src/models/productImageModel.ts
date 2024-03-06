import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "productImages",
})
export class ProductImages extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  product!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image!: string;
}