import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "users",
})
export class Users extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "USER",
  })
  role!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  city: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  passwordResetToken: string | undefined;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  passwordResetExpires: Date | undefined;
}


