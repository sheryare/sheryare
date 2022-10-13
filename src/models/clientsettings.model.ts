import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
@Entity("ClientSettings")
export class ClientSettings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("varchar")
  clientguid: string;
  @Column("varchar")
  logo: string;
  @Column("tinyint")
  accountneedstobeactivated: boolean;
  @Column("tinyint")
  userneedstoconfirmmobile: boolean;
  @Column("tinyint")
  userneedstoconfirmemail: boolean;
  @Column("varchar")
  google_captcha2: string;
  @Column("varchar")
  google_captcha3: string;
  @Column({ type: "longtext" })
  generalsettings: string;
  @Column({ type: "longtext" })
  @CreateDateColumn({ name: "created_at" })
  createAt: Date;
  @UpdateDateColumn({ name: "updated_at" })
  updateAt: Date;
  @Column("varchar")
  regionalsettings: string;
  @Column("varchar")
  primarycolor: string;
  @Column({ type: "longtext" })
  smssender: string;
  @Column("varchar")
  iforgeturl: string;
  @Column("varchar")
  mailactivationurl: string;
  @Column("tinyint")
  useExternalLogin: boolean;
  @Column("tinyint")
  externalLoginConfirmed: boolean;
  @Column({ type: "longtext" })
  accountsettings: string;
  @Column({ type: "longtext" })
  emailsettings: string;
}
