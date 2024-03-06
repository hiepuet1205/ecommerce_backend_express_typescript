import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "orders",
})
export class Orders extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  paymentMethod!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: "fast"
  })
  deliveryMethod!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  itemsPrice!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  shippingPrice!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  totalPrice!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  user!: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPaid!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  paidAt: string | undefined;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isDelivered!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  deliveredAt: boolean | undefined;
}
