import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
@Entity("OrderStatus")
export class OrderStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  title: string;
  @Column("int")
  StatusCode: number;
}
