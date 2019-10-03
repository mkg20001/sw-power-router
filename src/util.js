'use strict'

const Joi = require('@hapi/joi')

module.exports = {
  vf: (...a) => {
    const f = a.pop()

    const schema = Joi.array().ordered(...a)

    return (...a) => {
      const {error, value} = schema.validate(a)

      if (error) {
        throw error
      }

      f(...value)
    }
  }
}
