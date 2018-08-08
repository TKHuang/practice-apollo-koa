import Debug from 'debug'
import { PubSub } from 'graphql-subscriptions'

const debug = Debug('GraphQL:resolvers')

const pubsub = new PubSub()

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

const resolvers = {
  Book: {
    title(books, args) {
      debug(`Book.ISBN: ${args.ISBN}`)
      return books.title
    },
    author(books) {
      return books.author
    },
    findAll() {
      return books
    },
  },
  Author: {
    name(book) {
      return book.name
    },
  },
  Query: {
    getBooks(root, args, context, info) {
      return books
    },
  },
  Mutation: {
    addBook(root, args, context) {
      debug(`args: ${JSON.stringify(args, null, 2)}`)
      pubsub.publish('bookAdded', { bookAdded: args })
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
  Subscription: {
    bookAdded(args) {
      debug(`bookAdded: ${args}`)
      return args
    },
    // bookAdded: {
    // Additional event labels can be passed to asyncIterator creation
    //   subscribe: () => pubsub.asyncIterator([PS_BOOK_ADDED]),
    // },
  },
}
export { resolvers, pubsub }
