import DateValidator from './date-validator'
import NumberValidator from './number-validator'
import StringValidator from './string-validator'

/**
 * Interpret schema definitions and validate field
 * values based on the definition.
 * @param {Object} schemaDefinition
 */
export default class Schema {
  constructor (schemaDefinition) {
    this.schemaDefinition = schemaDefinition
    this.validators = this.createValidators()
  }

  /**
   * Loops through the schema definition and extracts the
   * default value from each feild.
   * @returns {Object} consisting of field names and their default value
   */
  defaultValues () {
    const defaultValues = {}
    Object.keys(this.schemaDefinition).forEach((key) => {
      if (this.schemaDefinition[key].defaultValue !== undefined) {
        defaultValues[key] = this.schemaDefinition[key].defaultValue
      }
    })
    return defaultValues
  }

  /**
   * Runs the validation rule on every field.
   * @param {*} fields list of form fields
   * @param {boolean} checkAll forces a check on all fields
   * @returns {Object} containing all fields with a validation error
   */
  validate (fields, checkAll = false) {
    const errors = {}
    Object.keys(this.schemaDefinition).forEach((key) => {
      const {
        defaultValue,
        isRequired,
        alwaysCheck
      } = this.schemaDefinition[key]
      const check = isRequired || alwaysCheck || (checkAll && (isRequired || fields[key] !== '')) || defaultValue !== fields[key]
      if (check) {
        const messages = this.validators[key].validate(fields[key], fields)
        if (messages.length > 0) {
          errors[key] = messages.shift()
        }
      }
    })

    return errors
  }

  /**
   * Validates fields and returns true if no errors are returned by the validate
   * function.
   * @param {*} fields list of form fields
   * @returns {boolean} that is true if an empty object is returned by validate
   */
  isValid (fields) {
    return Object.keys(this.validate(fields, true)).length === 0
  }

  /**
   * Creates an object of field names associated with
   * the correct type of Validator.
   * @returns {Object} of fields and their validators
   */
  createValidators () {
    const validators = {}
    Object.keys(this.schemaDefinition).forEach((key) => {
      const { type } = this.schemaDefinition[key]
      switch (type) {
        case 'number':
          validators[key] = new NumberValidator(this.schemaDefinition[key])
          break

        case 'date':
          validators[key] = new DateValidator(this.schemaDefinition[key])
          break

        default:
          validators[key] = new StringValidator(this.schemaDefinition[key])
      }
    })

    return validators
  }

  /**
   * Returns the current schema definition.
   * @returns {Object} containing the schema definition
   */
  definition () {
    return this.schemaDefinition
  }
}
