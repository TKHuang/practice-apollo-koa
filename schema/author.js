const resolvers = {
  Author: {
    name(book) {
      return book.name
    },
  },
}

module.exports = {
  resolvers,
}
