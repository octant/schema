import Validator from "./validator";

/**
 * Date validator.
 * @param {Object} fieldDefinition schema for specific field
 */
export default class DateValidator extends Validator {
  /**
   * Tests that field value is after or on the minimum date.
   * @param {String} value date string in the form 'YYYY-MM-DD'
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  greaterThan(value) {
    const { min, prompt } = this.fieldDefinition;
    const userYMD = value.split("-");
    const minYMD = min.split("-");
    const userDate = new Date(userYMD[0], userYMD[1] - 1, userYMD[0]);
    const minDate = new Date(minYMD[0], minYMD[1] - 1, minYMD[0]);

    return {
      passed: +userDate >= +minDate,
      message:
        prompt === undefined ? `should be no earlier than ${min}` : prompt
    };
  }

  /**
   * Tests that field value is before or on the maximum date.
   * @param {String} value date string in the form 'YYYY-MM-DD'
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  lessThan(value) {
    const { max, prompt } = this.fieldDefinition;
    const userYMD = value.split("-");
    const maxYMD = max.split("-");
    const userDate = new Date(userYMD[0], userYMD[1] - 1, userYMD[0]);
    const maxDate = new Date(maxYMD[0], maxYMD[1] - 1, maxYMD[0]);

    return {
      passed: +userDate <= +maxDate,
      message: prompt === undefined ? `should be no later than ${max}` : prompt
    };
  }
}
