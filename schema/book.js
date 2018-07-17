const resolvers = {
  Book: {
    title(books, args) {
      console.log(`Book.ISBN: ${args.ISBN}`)
      return books.title
    },
    author(books) {
      return books.author
    },
  },
}

module.exports = { resolvers }
