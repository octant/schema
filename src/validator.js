export default class Validator {
  constructor (fieldDefinition) {
    this.fieldDefinition = fieldDefinition
  }

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

  properlyFormatted (value) {
    const {regEx, prompt} = this.fieldDefinition
    return {
      passed: Array.isArray(value.match(regEx)),
      message: prompt === undefined ? `improperly formatted` : prompt
    }
  }

  invokeCustomValidation (fields) {
    const {custom, prompt} = this.fieldDefinition
    return {
      passed: custom(fields),
      message: prompt === undefined ? `custom validation failed` : prompt
    }
  }
}
