import Validator from './validator'

export default class NumberValidator extends Validator {
  greaterThan (value) {
    const {min, prompt} = this.fieldDefinition
    return {
      passed: Number(value) >= Number(min),
      message: prompt === undefined ? `should be no less than ${min}` : prompt
    }
  }

  lessThan (value) {
    const {max, prompt} = this.fieldDefinition
    return {
      passed: Number(value) <= Number(max),
      message: prompt === undefined ? `should be no more than ${max}` : prompt
    }
  }
}
