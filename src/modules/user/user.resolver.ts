import { GraphQLError } from "graphql";
import { File, ForToken, SignIn, SignUp, UserByUsername } from "./user.types";
import { AppDataSource } from "../../config/connection";
import { User } from "../../model/user";
import { resolve } from "path";
import fs, { createWriteStream } from "fs";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { GraphQLUpload } from "graphql-upload-ts";

export default {
  Query: {
    user: async (_: any, __: any, { access_token }: ForToken) => {
      try {
        jwt.verify(access_token, "1234"); // ustozdan sorash kere
        const userRepository = AppDataSource.getRepository(User);
        const getAllUsers = await userRepository.find();
        return getAllUsers;
      } catch (error: any) {
        return new GraphQLError("User is not authenficated", {
          extensions: {
            code: " UNAUTHENFICATED",

            http: { status: 401 },
          },
        });
      }
    },

    userByUsername: async (
      _: any,
      { username }: UserByUsername,
      { access_token }: ForToken
    ) => {
      const toCheckToken = jwt.verify(access_token, "1234");

      if (!toCheckToken) {
        return new GraphQLError("token is invalid", {
          extensions: {
            code: "Unauthorized",

            http: { status: 401 },
          },
        });
      }

      const userRepository = AppDataSource.getRepository(User);

      const findUser = await userRepository.findOneBy({ username });

      if (!findUser) {
        console.log(1);
        return new GraphQLError("user is not found", {
          extensions: {
            code: "NOT_FOUND",

            http: { status: 404 },
          },
        });
      }

      return findUser;
    },
  },
  Mutation: {
    signIn: async (_: any, { username, password }: SignIn) => {
      const userRepository = AppDataSource.getRepository(User);

      const findUser = await userRepository.findOneBy({ username });

      if (!findUser) {
        return new GraphQLError("user is not found", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 404 },
          },
        });
      }

      const comparePassword = await bcrypt.compare(password, findUser.password);

      if (!comparePassword) {
        return new GraphQLError("username or password is invalid", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 400 },
          },
        });
      }

      const getToken = jwt.sign({ id: findUser.id }, "1234");

      return {
        success: true,
        data: findUser,
        access_token: getToken,
      };
    },

    signUp: async (_: any, { username, password }: SignUp) => {
      const userRepository = AppDataSource.getRepository(User);

      const findUser = await userRepository.findOneBy({ username });

      if (findUser) {
        return new GraphQLError("user is already exist", {
          extensions: {
            code: "BAD_REQUEST",
            http: { status: 400 },
          },
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const createUser = new User();
      createUser.username = username;
      createUser.password = hashPassword;
      await AppDataSource.manager.save(createUser);

      const getToken = jwt.sign({ id: createUser.id }, "1234");

      return {
        success: true,
        data: createUser,
        access_token: getToken,
      };
    },

    uploadFile: async (
      _: any,
      { file, id }: File,
      { access_token }: ForToken
    ) => {
      try {
        let { filename, createReadStream } = await file;
        console.log(filename);

        filename = Date.now() + filename.replace(/\s/g, "");
        const stream = createReadStream();
        const out = createWriteStream(resolve("uploads", filename));
        stream.pipe(out);

        return "file upload";
      } catch (error: any) {
        console.log(error.message);
      }
    },
  },
  Upload: GraphQLUpload,
};
