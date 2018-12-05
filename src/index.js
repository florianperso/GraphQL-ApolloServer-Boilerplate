import { ApolloServer, gql } from 'apollo-server';
import path from "path";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";


const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")), {
  all: true,
});

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers")),
  { all: true },
);

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
