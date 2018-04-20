/* eslint-env jest */

import Validator from './validator'

describe('Validator', () => {
  const fieldDefinition = {
    custom: ({age}) => (age > 40),
    isRequired: true,
    regEx: /test/i
  }

  const validator = new Validator(fieldDefinition)
  const fields = {
    name: 'Steve',
    age: 48
  }

  test('returns an empty array when a valid field value is used', () => {
    expect(validator.validate('test value', fields)).toEqual([])
  })

  test('returns an array of error messages', () => {
    const invalidField = {...fields, age: 30}
    expect(validator.validate('value', fields)).toEqual(['improperly formatted'])
    expect(validator.validate('test value', invalidField)).toEqual(['custom validation failed'])
  })
})
