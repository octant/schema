/* eslint-env jest */

import DateValidator from './date-validator'

describe('DateValidator', () => {
  const fieldDefinition = {
    isRequired: true,
    min: '2018-01-01',
    max: '2018-02-28'
  }

  const fieldDefinitionWithCustomMessage = {
    isRequired: true,
    min: '2018-01-01',
    max: '2018-02-28',
    prompt: 'should be between 2018-01-01 and 2018-02-28'
  }

  const validator = new DateValidator(fieldDefinition)
  const customMessageValidator = new DateValidator(fieldDefinitionWithCustomMessage)

  const fields = {
    name: 'Steve',
    age: 48
  }

  test('returns an empty array when a valid field value is used', () => {
    expect(validator.validate('2018-01-27', fields)).toEqual([])
  })

  test('returns an array of error messages for invalid values', () => {
    expect(validator.validate('2017-12-25', fields)).toEqual(['should be no earlier than 2018-01-01'])
    expect(validator.validate('2018-03-12', fields)).toEqual(['should be no later than 2018-02-28'])
  })

  test('returns a custom message when prompt is present and validation fails', () => {
    expect(customMessageValidator.validate('2018-03-12', fields)).toEqual(['should be between 2018-01-01 and 2018-02-28'])
  })
})
