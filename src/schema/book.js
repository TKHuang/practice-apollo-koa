import Author from './author'

const typeDef = `
  type Book {
    title(ISBN: Int): String
    author: Author
    authorDup: Author
    findAll: Book
  }
`
const resolvers = {
  Book: {
    title(books, { ISBN }) {
      console.log(`Book.ISBN: ${ISBN}`)
      return books.title
    },
    author(books) {
      return books.author
    },
  },
}

export default {
  typeDef: () => [typeDef, Author.typeDef],
  resolvers,
}
