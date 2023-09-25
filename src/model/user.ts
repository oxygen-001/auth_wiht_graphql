import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./image";

@Entity("users")
export class User {
  declare comparePassword: boolean;

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Photo, (photo) => photo.user)
  photos: Photo[];
}
