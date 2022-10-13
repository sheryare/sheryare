import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from "typeorm";
import { Orders } from "./order.model";
import { Product } from "./product.model";
@Entity("OrderItems")
export class OrderItems extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @PrimaryColumn("int")
  orderid: number;
  @PrimaryColumn("int")
  productid: number;
  @Column("int")
  subscriptionId: number;
  @Column("float")
  price: number;
  @Column("float")
  priceWithoutTax: number;
  @Column("float")
  productprice: number;
  @Column("float")
  weight: number;
  @CreateDateColumn({ name: "created_at" })
  createAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updateAt: Date;
  @Column("varchar")
  sku: string;
  @Column("varchar")
  productTitle: string;
  @Column("varchar")
  orderInfo: string;
  @Column("float")
  quantity: number;
  @Column("varchar")
  imageUrl: string;
  @Column("tinyint")
  isDeleted: boolean;
  @Column("tinyint")
  isVirtual: boolean;
  @Column("tinyint")
  cartStatus: number;
  @Column("longtext")
  selectedOptions: string;
  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    cascade: true,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "productid" })
  public product: Product;
  @ManyToOne(() => Orders, (order) => order.orderItems, {
    cascade: true,
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "orderid" })
  public order: Orders;
}
