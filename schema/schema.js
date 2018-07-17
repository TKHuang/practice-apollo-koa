const { gql, MockList } = require('apollo-server-koa')
const { merge } = require('lodash')
const Book = require('./book.js')
const Author = require('./author.js')

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: { name: 'J.K. Rowling' },
  },
  {
    title: 'Jurassic Park',
    author: { name: 'Michael Crichton' },
  },
]

const resolvers = merge(
  {
    Query: {
      getBooks(root, args, context, info) {
        console.log(`getBooks.ISBN: ${args.ISBN}`)
        return books
      },
    },
  },
  Book.resolvers,
  Author.resolvers,
)

const mocks = {
  GG: () => ({
    qq: () => 'qq',
    ff: () => 'ff',
    time: () => new MockList([1, 10]),
  }),
}
// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title(ISBN: Int): String
    author: Author
    authorDup: Author
  }

  type Author {
    name: String
    fuck: GG
  }

  type GG {
    gg: String
    ff: String
    time: [Int]
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    getBooks(ISBN: Int): [Book]
  }
`

module.exports = {
  typeDefs,
  resolvers,
  mocks,
}
