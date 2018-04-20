/**
 * API:
 * alwaysCheck
 * type: [
 *  input [
 *    button,
 *    checkbox,
 *    date*
 *    number*,
 *    password,
 *    radio,
 *    range,
 *    reset,
 *    submit,
 *    text*,
 *  ],
 *  select,
 *  textarea
 * ]
 * custom:
 * default:
 * label:
 * max:
 * min:
 * placeHolder:
 * options:
 * required:
 */
const schema = {
  size: {
    type: 'select',
    label: 'Size',
    defaultValue: '',
    isRequired: true,
    options: [
      {value: '', text: ''},
      {value: 's', text: 'Small'},
      {value: 'm', text: 'Medium'},
      {value: 'l', text: 'Large'}
    ]
  },

  startDate: {
    type: 'date',
    label: 'Start Date',
    placeholder: 'YYYY-MM-DD',
    defaultValue: '',
    isRequired: true,
    min: '2016-10-01',
    max: (() => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return today.toISOString().substr(0, 10)
    })()
  },

  completionDate: {
    type: 'date',
    label: 'Completion Date',
    placeholder: 'YYYY-MM-DD',
    defaultValue: '',
    isRequired: true,
    custom: ({ completionDate, startDate }) => {
      const startDateTime = new Date(startDate)
      const completionDateTime = new Date(completionDate)

      return (+startDateTime <= +completionDateTime)
    },
    min: '2016-10-01',
    max: (() => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return today.toISOString().substr(0, 10)
    })()
  },

  firstName: {
    type: 'text',
    label: 'First Name',
    defaultValue: '',
    regEx: /^[A-Z][a-zA-Z].*$/,
    min: 2
  },

  lastName: {
    type: 'text',
    label: 'Last Name',
    defaultValue: '',
    min: 2
  }
}

export default schema
