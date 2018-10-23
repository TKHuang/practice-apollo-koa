import { SchemaDirectiveVisitor } from 'graphql-tools'
import { defaultFieldResolver } from 'graphql'

const typeDef = `
    directive @auth(requires:Role) on OBJECT | FIELD_DEFINITION
    enum Role {
      ADMIN
      REVIEWER
      USER
      UNKNOWN
    }
`

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    const requiredAuth = {
      requiredAuthRole: this.args.requires,
    }
    Object.assign(type, requiredAuth)
    this.constructor.ensureFieldsWrapped(type)
  }

  visitFieldDefinition(field, details) {
    const requiredAuth = {
      requiredAuthRole: this.args.requires,
    }
    Object.assign(field, requiredAuth)
    this.constructor.ensureFieldsWrapped(details.objectType)
  }

  static ensureFieldsWrapped(objectType) {
    const fields = objectType.getFields()
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName]
      const { resolve = defaultFieldResolver } = field
      const requiredRole = field.requiredAuthRole || objectType.requiredAuthRole
      field.resolve = async function newResolve(...args) {
        if (!requiredRole) return resolve.apply(this, args)
        const context = args[2]
        const { user } = context
        const { token } = context
        console.log(`token: ${JSON.stringify(token, null, 2)}`)
        if (!user) throw new Error('Not authorized.')
        return resolve.apply(this, args)
      }
    })
  }
}

export default {
  directive: AuthDirective,
  typeDef,
}
