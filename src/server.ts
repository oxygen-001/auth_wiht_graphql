import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import schema from "./modules/index";
import express from "express";
import { graphqlUploadExpress } from "graphql-upload-ts";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";

const app = express();
const httpServer = http.createServer(app);

async function toRun() {
  const server = new ApolloServer({
    schema,
    csrfPrevention: false,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3000 }, resolve)
  );

  // const { url } = await startStandaloneServer(server, {
  //   context: async ({ req, res }) => {
  //     const token = req.headers.authorization || "";

  //     return { access_token: token };
  //   },
  // });

  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 1 }),
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.authorization }),
    })
  );
  console.log(`🚀  Server ready at: ${3000}`);
}

toRun();
