/* eslint-env jest */

import Schema from './schema'
import definition from './schema-definition'

describe('Schema', () => {
  test('has a defaultValues function', () => {
    const schema = new Schema(definition)
    expect(schema.defaultValues()).toBeInstanceOf(Object)
  })
})
