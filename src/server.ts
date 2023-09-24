import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import schema from "./modules/index";

const server = new ApolloServer({
  schema,
});

async function toRun() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 3000 },
    context: async ({ req, res }) => {
      const token = req.headers.authorization || "";

      return { access_token: token };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
}

toRun();
