import bcrypt from 'bcrypt'
import Debug from 'debug'
import Account from '../db/account'

const debug = Debug('app:account')
const SALT_ROUNDS = 10

const updateOne = async (ctx, { account, update }) => {
  try {
    const result = await Account.updateOne(
      {
        _id: account._id,
      },
      update,
    )
    console.log('Account Updated :', result.modifiedCount)
  } catch (err) {
    throw new Error(err.message)
  }
}

const add = async (ctx, { username, password }) => {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS)
    const acc = new Account({
      username,
      password: hash,
    })
    const cursor = await acc.save()
    return cursor
  } catch (err) {
    switch (err.code) {
      case 11000: // duplicate key error
        throw new Error(`username ${username} already used.`)
        break
      default:
        console.log(`err: ${JSON.stringify(err, null, 2)}`)
        throw new Error('Internal server error.')
    }
  }
}

export default {
  add,
  updateOne,
}
