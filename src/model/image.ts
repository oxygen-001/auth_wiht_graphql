import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user";

@Entity("photos")
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  images: string;

  @ManyToOne(() => User, (user) => user.photos)
  user: User;
}
