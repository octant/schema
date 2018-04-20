/* eslint-env jest */

import Validator from './validator'

describe('Validator', () => {
  const fieldDefinition = {
    type: 'text',
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

  test('returns an * for required fields that have no value set', () => {
    expect(validator.validate('', fields)).toEqual(['*'])
  })

  test('returns an array of error messages', () => {
    const invalidField = {...fields, age: 30}
    expect(validator.validate('value', fields)).toEqual(['improperly formatted'])
    expect(validator.validate('test value', invalidField)).toEqual(['custom validation failed'])
  })

  test('returns a custom message if prompt is included in definition', () => {
    const customValidator = new Validator({
      type: 'text',
      custom: ({age}) => (age < 40),
      isRequired: true,
      regEx: /test/i,
      prompt: 'must contain "test" and age has to be less than 40'
    })

    const result = customValidator.validate('taste', fields)
    expect(result).toContain('must contain "test" and age has to be less than 40')
    expect(result.length).toBe(2)
  })
})
