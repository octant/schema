/* eslint-env jest */

import Schema from './schema'

describe('Schema', () => {
  const schemaDefinition = {
    dob: {
      type: 'date',
      defaultValue: '2000-01-01',
      isRequired: true,
      min: '1910-01-01',
      max: '2018-02-01'
    },
    firstName: {
      type: 'text',
      isRequired: true,
      min: 2,
      max: 20
    },
    lastName: {
      type: 'text',
      isRequired: true,
      min: 2,
      max: 25
    },
    numberOfVehicles: {
      type: 'number',
      defaultValue: 1,
      min: 1
    }
  }

  const validator = new Schema(schemaDefinition)

  test('returns fields with default values applied', () => {
    expect(validator.defaultValues()).toEqual({
      dob: '2000-01-01',
      firstName: '',
      lastName: '',
      numberOfVehicles: 1
    })
  })

  test('check can be forced for all fields even if they are not a required field', () => {
    const fields = {
      dob: '1985-03-02',
      firstName: 'Michael',
      lastName: 'Wood'
    }
    expect(validator.validate(fields, true)).toEqual({
      numberOfVehicles: 'should not be less than 1'
    })
  })

  test('returns an empty array when all fields are valid', () => {
    const fields = {
      dob: '1985-03-02',
      firstName: 'Michael',
      lastName: 'Wood',
      numberOfVehicles: 1
    }
    expect(validator.validate(fields)).toEqual({})
    expect(validator.isValid(fields)).toBe(true)
  })

  test('fails validation when a required field is missing', () => {
    const fields = {
      dob: '1985-03-02',
      firstName: 'Michael',
      numberOfVehicles: 33
    }
    expect(validator.validate(fields)).toEqual({lastName: 'lastName is a required field'})
  })

  test('returns errors for all failed validations', () => {
    const fields = {
      dob: '1909-03-02',
      firstName: 'M',
      numberOfVehicles: 0
    }

    expect(validator.validate(fields)).toEqual({
      numberOfVehicles: 'should not be less than 1',
      firstName: 'should be no shorter than 2 characters',
      lastName: 'lastName is a required field',
      dob: 'should be no earlier than 1910-01-01'
    })
  })
})
