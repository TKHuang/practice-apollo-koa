import MockData from './mockdata'

const typeDef = `
  type Author {
    name: String
    mockData: MockData
    gender: String
  }
`
const resolvers = {
  Author: {
    name(author) {
      return author.name
    },
    gender(author) {
      return author.gender
    },
  },
}

export default {
  typeDef: () => [typeDef, MockData.typeDef],
  resolvers,
}
