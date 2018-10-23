const typeDef = `
  type Account {
    id: ID!
    username: String
  }

  input AccountInput {
      username: String
  }
`

const resolvers = {
  Account: {
    id(account) {
      return account._id
    },
    username(account) {
      return account.username
    },
  },
}

export default {
  typeDef: () => [typeDef],
  resolvers,
}
