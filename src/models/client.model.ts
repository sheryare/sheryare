import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
@Entity("Clients")
export class Clients extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  apiKey: string;
  @Column("varchar")
  apisecret: string;
  @Column("varchar")
  clientguid: string;
  @Column("varchar")
  email: string;
  @Column("varchar")
  password: string;
  @Column("varchar")
  projectguid: string;
  @Column("varchar")
  title: string;
  @CreateDateColumn({ name: "created_at" })
  createAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updateAt: Date;
  @Column("varchar")
  hostfolder: string;
  @Column("varchar")
  domainname: string;
  @Column("tinyint")
  useCustomlogin: boolean;
}
