import { MockList } from 'apollo-server-koa'

const typeDef = `
  type MockData {
    m1: String
    m2: String
    mockList: [Int]
  }
`

const resolvers = {
  MockData: () => ({
    m1: () => 'mock1',
    m2: () => 'mock2',
    mockList: () => new MockList([1, 10]),
  }),
}

export default {
  typeDef: () => [typeDef],
  resolvers,
}
