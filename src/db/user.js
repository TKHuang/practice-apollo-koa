import mongoose from 'mongoose'

const { Schema } = mongoose

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['MALE', 'FEMALE', 'OTHER'],
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: 'School',
  },
  headshotURL: { type: String },
  birth: { type: Date },
  friends: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  events: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
  },
  personalChannels: {
    type: Schema.Types.ObjectId,
    ref: 'PersonalChannel',
  },
  eventChannels: {
    type: Schema.Types.ObjectId,
    ref: 'EventChannel',
  },
})

const model = mongoose.model('User', User)

export default model
