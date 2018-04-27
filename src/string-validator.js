import Validator from "./validator";

/**
 * String validator.
 * @param {Object} fieldDefinition schema for specific field
 */
export default class StringValidator extends Validator {
  /**
   * Tests that field value is longer than the minimum length.
   * @param {String} value field value
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  greaterThan(value) {
    const { min, message } = this.fieldDefinition;
    return {
      passed: value.length >= min,
      message:
        message === undefined
          ? `should be no shorter than ${min} characters`
          : message
    };
  }

  /**
   * Tests that field value is shorter than the maximum length.
   * @param {String} value field value
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  lessThan(value) {
    const { max, message } = this.fieldDefinition;
    return {
      passed: value.length <= max,
      message:
        message === undefined
          ? `should be no longer than ${max} characters`
          : message
    };
  }
}
