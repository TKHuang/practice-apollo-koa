const resolvers = {
  Author: {
    name(book) {
      return book.name
    },
  },
}

// module.exports = {
//   resolvers,
// }

export default {
  resolvers,
}
