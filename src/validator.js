/**
 * Base class for specific validators.
 * @param {Object} fieldDefinition schema for specific field
 */
export default class Validator {
  constructor(fieldDefinition) {
    this.fieldDefinition = fieldDefinition;
  }

  /**
   * Validate a single field.
   * @param {*} fieldValue value of field
   * @param {Object} fields all fields in the form
   * @returns {Array} of all error messages for this field
   */
  validate(fieldValue, fields) {
    const { custom, required, max, min, pattern } = this.fieldDefinition;

    const messages = [];

    if (required) {
      const { passed, message } = { passed: fieldValue !== "", message: "*" };
      if (!passed) {
        messages.push(message);

        // Skip all other checks
        return messages;
      }
    }

    if (custom !== undefined) {
      const { passed, message } = this.invokeCustomValidation(fields);
      if (!passed) {
        messages.push(message);
      }
    }

    if (min !== undefined) {
      const { passed, message } = this.greaterThan(fieldValue);
      if (!passed) {
        messages.push(message);
      }
    }

    if (max !== undefined) {
      const { passed, message } = this.lessThan(fieldValue);
      if (!passed) {
        messages.push(message);
      }
    }

    if (pattern !== undefined) {
      const { passed, message } = this.properlyFormatted(fieldValue);
      if (!passed) {
        messages.push(message);
      }
    }

    return messages;
  }

  /**
   * Tests field value against the pattern in the field definition.
   * @param {String | Number} value field value
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  properlyFormatted(value) {
    const { pattern, prompt } = this.fieldDefinition;
    return {
      passed: pattern.test(value),
      message: prompt === undefined ? `improperly formatted` : prompt
    };
  }

  /**
   * Invokes the custom callback for the current field definition
   * @param {*} fields All for fields
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  invokeCustomValidation(fields) {
    const { custom, prompt } = this.fieldDefinition;
    return {
      passed: custom(fields),
      message: prompt === undefined ? `custom validation failed` : prompt
    };
  }
}
