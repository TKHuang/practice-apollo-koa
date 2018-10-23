import { gql, MockList, PubSub } from 'apollo-server-koa'
import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'
import Book from './book'
import Author from './author'
import UserQL from './user'
import AccountQL from './account'
import MockData from './mockdata'
import AuthDirective from '../directives/auth'
import Account from '../models/account'
import User from '../models/user'
import { signToken, verifyToken } from '../utils/jwt'

const pubsub = new PubSub()

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: {
      name: 'J.K. Rowling',
      gender: 'men',
    },
  },
  {
    title: 'Jurassic Park',
    author: {
      name: 'Michael Crichton',
      gender: 'women',
    },
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
  RootQuery: {
    getBooks(root, args, context, info) {
      return books
    },
  },
}
const mutation = {
  Mutation: {
    addBook(root, args, ctx) {
      console.log(`args: ${JSON.stringify(args, null, 2)}`)
      const { title, authorName } = args
      const book = {
        title,
        author: {
          name: authorName,
        },
      }
      pubsub.publish(PS_BOOK_ADDED, {
        bookAdded: book,
      })
      return books.push(book)
    },
    async register(root, { username, password }, ctx) {
      let res
      try {
        const accountCursor = await Account.add(ctx, {
          username,
          password,
        })
        const { username: user, role } = accountCursor
        const tokenPayload = {
          user,
          role,
        }
        res = signToken(tokenPayload)
      } catch (err) {
        throw new Error(err.message)
      }
      return res
    },
    async addUser(root, { account, user }, ctx) {
      let res
      try {
        const userCursor = await User.add(ctx, {
          account,
          user,
        })
        res = userCursor
      } catch (err) {
        throw new Error(err.message)
      }
      return res
    },
  },
}

const resolvers = merge(
  query,
  pubSub,
  mutation,
  Book.resolvers,
  Author.resolvers,
  UserQL.resolvers,
  AccountQL.resolvers,
)

const SchemaDefinition = `
  schema {
    query: RootQuery
    mutation: Mutation
    subscription: Subscription
  }
`

const Query = `
  type RootQuery @auth(requires: USER) {
    getBooks(ISBN: Int) : [Book] @auth(requires: ADMIN)
  }
`

const Subscription = `
  type Subscription {
    bookAdded: Book
  }
`

const Mutation = `
  type Mutation {
    addBook(title: String!, authorName: String): Book
    register(username: String!, password: String!): String
    addUser(account: AccountInput, user: UserInput): User
  }
`
const mocks = merge(MockData.resolvers)
// const mocks = {
//   mockData: () => ({
//     m1: () => 'qq',
//     m2: () => 'ff',
//     mockList: () => new MockList([1, 10]),
//   }),
// }

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
// const typeDefs = gql`
//   # Comments in GraphQL are defined with the hash (#) symbol.

//   # This "Book" type can be used in other type declarations.
//   type Book {
//     title(ISBN: Int): String
//     author: Author
//     authorDup: Author
//     findAll: Book
//   }

//   type Author {
//     name: String
//     fuck: GG
//   }

//   type GG {
//     gg: String
//     ff: String
//     time: [Int]
//   }

//   # The "Query" type is the root of all GraphQL queries.
//   # (A "Mutation" type will be covered later on.)
//   type Query {
//     getBooks(ISBN: Int): [Book]
//   }

//   type Subscription {
//     bookAdded: Book
//   }

//   type Mutation {
//     addBook(title: String, authorName: String): Book
//   }
// `

export default makeExecutableSchema({
  typeDefs: [
    Book.typeDef,
    Author.typeDef,
    AuthDirective.typeDef,
    UserQL.typeDef,
    AccountQL.typeDef,
    Subscription,
    SchemaDefinition,
    Query,
    Mutation,
  ],
  schemaDirectives: {
    auth: AuthDirective.directive,
  },
  resolvers,
})
export { mocks }
