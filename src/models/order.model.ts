import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { OrderItems } from "./orderItems.model";

@Entity("Orders")
export class Orders extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  clientguid: number;
  @Column("varchar")
  clientmemberguid: number;
  @Column("int")
  cartType: number;
  @Column("varchar")
  orderNumber: string;
  @Column("varchar")
  trackingNumber: string;
  @Column("varchar")
  customerName: string;
  @Column("varchar")
  customerImage: string;
  @Column({ type: "varchar" })
  shipmentInfo: string;
  @Column({ type: "varchar" })
  paymentInfo: string;
  @Column("int")
  orderStatus: number;
  @Column("int")
  paymentStatus: number;
  @Column("tinyint")
  isActualSale: number;
  @Column("float")
  cartTotal: number;
  @Column("float")
  shipmentTotal: number;
  @Column("float")
  totalTax: number;
  @Column("int")
  deliveryType: number;
  @Column("longtext")
  deliveryMethod: string;
  @Column("longtext")
  deliveryAddressInfo: string;
  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
  @Column("longtext")
  billingPerson: string;
  @Column("longtext")
  shippingPerson: string;
  @Column("longtext")
  extraFields: string;
  @Column("varchar")
  pickupTime: string;
  @Column("datetime")
  cartConvertDate: Date;
  @Column("varchar")
  cartConvertBy: string;
  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  public orderItems: OrderItems[];
}
