import mongoose from 'mongoose'

const { Schema } = mongoose

const Book = new Schema({
  title: {
    type: String,
    required: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
    index: true,
  },
})

const model = mongoose.model('Book', Book)

export default model
