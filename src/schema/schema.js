// const { gql, MockList, PubSub } = require('apollo-server-koa')
import { gql, MockList, PubSub } from 'apollo-server-koa'
import { merge } from 'lodash'
import Book from './book'
import Author from './author'
// const { merge } = require('lodash')
// const Book = require('./book.js')
// const Author = require('./author.js')

const pubsub = new PubSub()

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

const PS_BOOK_ADDED = 'BOOK_ADDED'
const pubSub = {
  Subscription: {
    bookAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([PS_BOOK_ADDED]),
    },
  },
}
const query = {
  Query: {
    getBooks(root, args, context, info) {
      return books
    },
  },
}
const mutation = {
  Mutation: {
    addBook(root, args, context) {
      console.log(`args: ${JSON.stringify(args, null, 2)}`)
      pubsub.publish(PS_BOOK_ADDED, { bookAdded: args })
      const { title, authorName } = args
      const book = {
        title,
        author: {
          name: authorName,
        },
      }
      return books.push(book)
    },
  },
}

const resolvers = merge(
  query,
  pubSub,
  mutation,
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
    findAll: Book
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

  type Subscription {
    bookAdded: Book
  }

  type Mutation {
    addBook(title: String, authorName: String): Book
  }
`

// export default typeDefs
export { typeDefs, resolvers, mocks }
