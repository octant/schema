import Validator from './validator'

/**
 * Number validator.
 * @param {Object} fieldDefinition schema for specific field
 */
export default class NumberValidator extends Validator {
  /**
   * Tests that field value is larger than the minimum.
   * @param {Number} value field value
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  greaterThan (value) {
    const {min, prompt} = this.fieldDefinition
    return {
      passed: Number(value) >= Number(min),
      message: prompt === undefined ? `should not be less than ${min}` : prompt
    }
  }

  /**
   * Tests that field value is less than the maximum.
   * @param {Number} value field value
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  lessThan (value) {
    const {max, prompt} = this.fieldDefinition
    return {
      passed: Number(value) <= Number(max),
      message: prompt === undefined ? `should not be more than ${max}` : prompt
    }
  }
}
