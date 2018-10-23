const typeDef = `
  type User {
    id: ID!,
    name: String,
    gender: UserGender,
    school: String,
    headshotURL: String,
    birth: String,
  }

  input UserInput {
    id: ID!,
    name: String,
  }

  enum UserGender {
    MALE,
    FEMALE,
    OTHER,
  }
`
const resolvers = {
  User: {
    id(user) {
      return user._id
    },
    name(user) {
      return user.name
    },
    gender(user) {
      return user.gender
    },
    school(user) {
      return user.shcool
    },
    headshotURL(user) {
      return user.headshotURL
    },
    birth(user) {
      return user.birth
    },
  },
}

export default {
  typeDef: () => [typeDef],
  resolvers,
}
