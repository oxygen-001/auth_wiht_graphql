import { DataSource } from "typeorm";
import { join } from "path";
import { User } from "../model/user";
import { Photo } from "../model/image";

const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  username: "postgres",
  host: "db",
  password: "password",
  database: "auth",
  entities: [User, Photo],
  synchronize: true,
  logging: false,
});

AppDataSource.initialize()
  .then(() => console.log("your db is 🚀"))
  .catch((error) => console.log(error.message));

export { AppDataSource };
