import Schema from './src/schema'
import definition from './schema-definition'

const schema = new Schema(definition)

const values = schema.defaultValues()
console.log(values)
console.log(schema.validate(values))
