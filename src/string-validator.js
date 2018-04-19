import Validator from './validator'

export default class StringValidator extends Validator {
  greaterThan (value) {
    const {min, prompt} = this.fieldDefinition
    return {
      passed: value.length >= min,
      message: prompt === undefined ? `should be no shorter than ${min} characters` : prompt
    }
  }

  lessThan (value) {
    const {max, prompt} = this.fieldDefinition
    return {
      passed: value.length <= max,
      message: prompt === undefined ? `should be no longer than ${max} characters` : prompt
    }
  }
}
