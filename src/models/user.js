import Debug from 'debug'
import { clearLine } from 'readline'
import Account from '../db/account'
import { updateOne as updateAccount } from './account'
import User from '../db/user'

const debug = Debug('app:account')

const add = async (ctx, { account, user }) => {
  try {
    // const {
    //   name,
    //   gender,
    //   school,
    //   headshotURL,
    //   birth,
    //   friends,
    //   events,
    //   personalCHannels,
    //   eventChannels,
    // } = user
    console.log(ctx)
    const userCopy = Object.assign({}, user)
    const { User } = ctx.db
    const { School } = ctx.db
    userCopy.school = await School.findOne({ name: user.school })
    console.log(`user: ${JSON.stringify(user, null, 2)}`)
    console.log(`userCopy: ${JSON.stringify(userCopy, null, 2)}`)
    const userToInsert = new User(userCopy)
    const userCursor = await userToInsert.save()
    await updateAccount(ctx, {
      account,
      update: { $set: { user: userCursor._id } },
    })
    return userCursor
  } catch (err) {
    debug(err)
    throw new Error(err.message)
  }
}

const update = async (ctx, {}) => {}
export default {
  add,
  update,
}
