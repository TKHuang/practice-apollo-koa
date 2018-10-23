import mongoose from 'mongoose'

const { Schema } = mongoose

const ROLE = {
  USER: 'USER',
  ADMIN: 'ADMIN',
}

const Account = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  username: {
    type: String,
    unique: true,
    index: true,
    required: [true, 'username required'],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Array,
    default: [ROLE.USER],
    validate: {
      validator(values) {
        return values.every(val => ROLE[val] !== undefined)
      },
      message: props => `${props.value} is not a valid role!`,
    },
  },
})

const model = mongoose.model('Account', Account)

export default model
