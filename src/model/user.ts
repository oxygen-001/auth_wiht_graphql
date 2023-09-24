import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import bcryp from "bcrypt";

@Entity("users")
export class User {
  declare comparePassword: boolean;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;
}
