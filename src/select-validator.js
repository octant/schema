import Validator from './validator'

export default class SelectValidator extends Validator {
  selectedValue (value) {
    const {min, prompt} = this.fieldDefinition
    return {
      passed: value !== '',
      message: prompt === undefined ? `must select a vlue ${min}` : prompt
    }
  }
}
