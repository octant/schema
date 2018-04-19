import Validator from './validator'

export default class DateValidator extends Validator {
  greaterThan (value) {
    const {min, prompt} = this.fieldDefinition
    const userDate = new Date(value)
    const minDate = new Date(min)

    return {
      passed: +userDate >= +minDate,
      message: prompt === undefined ? `should be no earlier than ${min}` : prompt
    }
  }

  lessThan (value) {
    const {max, prompt} = this.fieldDefinition
    const userDate = new Date(value)
    const maxDate = new Date(max)
    return {
      passed: +userDate <= +maxDate,
      message: prompt === undefined ? `should be no later than ${max}` : prompt
    }
  }
}
