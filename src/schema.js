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
   * default value from each field.
   * @returns {Object} consisting of field names and their default value
   */
  defaultValues () {
    const defaultValues = {}
    Object.keys(this.schemaDefinition).forEach((key) => {
      defaultValues[key] = this.schemaDefinition[key].defaultValue || ''
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

    /**
     * Check that all required fields in the schemaDefinition are present.
     * If checkAll is true the field will be checked whether it is required or not
     */
    Object.keys(this.schemaDefinition).forEach((field) => {
      if (Object.keys(fields).indexOf(field) === -1 && (checkAll || this.schemaDefinition[field].isRequired)) {
        errors[field] = `${field} is a required field`
      }
    })

    const fieldsToCheck = checkAll ? this.schemaDefinition : fields
    Object.keys(fieldsToCheck).forEach((key) => {
      const {
        defaultValue
      } = this.schemaDefinition[key]

      /**
       * Validate if checkAll is true but skip validating empty fields
       * or fields that are set to their default value.
       */
      const check = (checkAll && fields[key] !== '') || defaultValue !== fields[key]
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
}
