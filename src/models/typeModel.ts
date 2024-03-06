import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "types",
})
export class Types extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;
}