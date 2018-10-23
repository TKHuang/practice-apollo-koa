import mongoose from 'mongoose'

const DB_URI = `mongodb://localhost:${process.env.DB_PORT}/test`
mongoose.connect(DB_URI)

const db = mongoose.connection

db.on('error', () => console.error('DB connection error.'))
db.once('open', () => {
  console.log('DB connected.')
})
