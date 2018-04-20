import Validator from './validator'

export default class SelectValidator extends Validator {
  selectedValue (value) {
    const {prompt} = this.fieldDefinition
    return {
      passed: value !== '',
      message: prompt === undefined ? `must select a value` : prompt
    }
  }
}
