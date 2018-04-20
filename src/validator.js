/**
 * Base class for specific validators.
 * @param {Object} fieldDefinition schema for specific field
 */
export default class Validator {
  constructor (fieldDefinition) {
    this.fieldDefinition = fieldDefinition
  }

  /**
   * Validate a single field.
   * @param {*} fieldValue value of field
   * @param {Object} fields all fields in the form
   * @returns {Array} of all error messages for this field
   */
  validate (fieldValue, fields) {
    const {
      custom,
      isRequired,
      max,
      min,
      options,
      regEx
    } = this.fieldDefinition

    let messages = []

    if (isRequired) {
      const { passed, message } = { passed: fieldValue !== '', message: '*' }
      if (!passed) {
        messages.push(message)
      }
    }

    if (custom !== undefined) {
      const { passed, message } = this.invokeCustomValidation(fields)
      if (!passed) {
        messages.push(message)
      }
    }

    if (min !== undefined) {
      const { passed, message } = this.greaterThan(fieldValue)
      if (!passed) {
        messages.push(message)
      }
    }

    if (max !== undefined) {
      const { passed, message } = this.lessThan(fieldValue)
      if (!passed) {
        messages.push(message)
      }
    }

    if (regEx !== undefined) {
      const { passed, message } = this.properlyFormatted(fieldValue)
      if (!passed) {
        messages.push(message)
      }
    }

    if (options !== undefined) {
      const { passed, message } = this.selectedValue(fieldValue)
      if (!passed) {
        messages.push(message)
      }
    }

    return messages
  }

  /**
   * Tests field value against the regEx in the field definition.
   * @param {String | Number} value field value
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  properlyFormatted (value) {
    const {regEx, prompt} = this.fieldDefinition
    return {
      passed: regEx.test(value),
      message: prompt === undefined ? `improperly formatted` : prompt
    }
  }

  /**
   * Invokes the custom callback for the current field definition
   * @param {*} fields All for fields
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  invokeCustomValidation (fields) {
    const {custom, prompt} = this.fieldDefinition
    return {
      passed: custom(fields),
      message: prompt === undefined ? `custom validation failed` : prompt
    }
  }
}
