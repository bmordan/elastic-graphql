const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./src/schema')

const expressPort = process.env.port || process.env.PORT || 9201;

const server = express();
server.use(
  '/',
  graphqlHTTP({
    schema: (schema),
    graphiql: true,
    formatError: error => ({
      message: error.message,
      stack: error.stack.split('\n'),
    }),
  })
);

server.listen(expressPort, () => {
  console.log(`The server is running at http://localhost:${expressPort}/`);
});