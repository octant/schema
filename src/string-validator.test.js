/* eslint-env jest */

import StringValidator from './string-validator'

describe('StringValidator', () => {
  const fieldDefinition = {
    isRequired: true,
    min: 2,
    max: 6
  }

  const fieldDefinitionWithCustomMessage = {
    isRequired: true,
    min: 2,
    max: 6,
    prompt: 'should be between 2 and 6'
  }

  const validator = new StringValidator(fieldDefinition)
  const customMessageValidator = new StringValidator(fieldDefinitionWithCustomMessage)

  const fields = {
    name: 'Steve',
    age: 48
  }

  test('returns an empty array when a valid field value is used', () => {
    expect(validator.validate('test', fields)).toEqual([])
  })

  test('returns an array of error messages for invalid values', () => {
    expect(validator.validate('t', fields)).toEqual(['should be no shorter than 2 characters'])
    expect(validator.validate('test value', fields)).toEqual(['should be no longer than 6 characters'])
  })

  test('returns a custom message when prompt is present and validation fails', () => {
    expect(customMessageValidator.validate('t', fields)).toEqual(['should be between 2 and 6'])
  })
})
