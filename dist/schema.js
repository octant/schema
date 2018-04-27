/**
 * Base class for specific validators.
 * @param {Object} fieldDefinition schema for specific field
 */
class Validator {
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
    const { pattern, message } = this.fieldDefinition;
    return {
      passed: pattern.test(value),
      message: message === undefined ? `improperly formatted` : message
    };
  }

  /**
   * Invokes the custom callback for the current field definition
   * @param {*} fields All for fields
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  invokeCustomValidation(fields) {
    const { custom, message } = this.fieldDefinition;
    return {
      passed: custom(fields),
      message: message === undefined ? `custom validation failed` : message
    };
  }
}

/**
 * Date validator.
 * @param {Object} fieldDefinition schema for specific field
 */
class DateValidator extends Validator {
  /**
   * Tests that field value is after or on the minimum date.
   * @param {String} value date string in the form 'YYYY-MM-DD'
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  greaterThan(value) {
    const { min, message } = this.fieldDefinition;
    const userYMD = value.split("-");
    const minYMD = min.split("-");
    const userDate = new Date(userYMD[0], userYMD[1] - 1, userYMD[0]);
    const minDate = new Date(minYMD[0], minYMD[1] - 1, minYMD[0]);

    return {
      passed: +userDate >= +minDate,
      message:
        message === undefined ? `should be no earlier than ${min}` : message
    };
  }

  /**
   * Tests that field value is before or on the maximum date.
   * @param {String} value date string in the form 'YYYY-MM-DD'
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  lessThan(value) {
    const { max, message } = this.fieldDefinition;
    const userYMD = value.split("-");
    const maxYMD = max.split("-");
    const userDate = new Date(userYMD[0], userYMD[1] - 1, userYMD[0]);
    const maxDate = new Date(maxYMD[0], maxYMD[1] - 1, maxYMD[0]);

    return {
      passed: +userDate <= +maxDate,
      message:
        message === undefined ? `should be no later than ${max}` : message
    };
  }
}

/**
 * Number validator.
 * @param {Object} fieldDefinition schema for specific field
 */
class NumberValidator extends Validator {
  /**
   * Tests that field value is larger than the minimum.
   * @param {Number} value field value
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  greaterThan(value) {
    const { min, message } = this.fieldDefinition;
    return {
      passed: Number(value) >= Number(min),
      message:
        message === undefined ? `should not be less than ${min}` : message
    };
  }

  /**
   * Tests that field value is less than the maximum.
   * @param {Number} value field value
   * @returns {Object} containing the pass/fail result and error message
   * if validation failed
   */
  lessThan(value) {
    const { max, message } = this.fieldDefinition;
    return {
      passed: Number(value) <= Number(max),
      message:
        message === undefined ? `should not be more than ${max}` : message
    };
  }
}

/**
 * String validator.
 * @param {Object} fieldDefinition schema for specific field
 */
class StringValidator extends Validator {
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

/**
 * Interpret schema definitions and validate field
 * values based on the definition.
 * @param {Object} schemaDefinition
 */
class Schema {
  constructor(schemaDefinition) {
    this.schemaDefinition = schemaDefinition;
    this.validators = this.createValidators();
  }

  /**
   * Loops through the schema definition and extracts the
   * default value from each field.
   * @returns {Object} consisting of field names and their default value
   */
  defaultValues() {
    const defaultValues = {};
    Object.keys(this.schemaDefinition).forEach(key => {
      defaultValues[key] = this.schemaDefinition[key].defaultValue || "";
    });
    return defaultValues;
  }

  /**
   * Runs the validation rule on every field.
   * @param {*} fields list of form fields
   * @param {boolean} checkAll forces a check on all fields
   * @returns {Object} containing all fields with a validation error
   */
  validate(fields, checkAll = false) {
    const errors = {};

    Object.keys(this.schemaDefinition).forEach(key => {
      const { defaultValue, required, alwaysCheck } = this.schemaDefinition[
        key
      ];

      const check =
        required ||
        alwaysCheck ||
        (checkAll && (required || fields[key] !== "")) ||
        defaultValue !== fields[key];
      if (check) {
        const messages =
          fields[key] !== undefined
            ? this.validators[key].validate(fields[key], fields)
            : ["missing from form"];
        if (messages.length > 0) {
          errors[key] = messages.shift();
        }
      }
    });

    return errors;
  }

  /**
   * Validates fields and returns true if no errors are returned by the validate
   * function.
   * @param {*} fields list of form fields
   * @returns {boolean} that is true if an empty object is returned by validate
   */
  isValid(fields) {
    return Object.keys(this.validate(fields, true)).length === 0;
  }

  /**
   * Creates an object of field names associated with
   * the correct type of Validator.
   * @returns {Object} of fields and their validators
   */
  createValidators() {
    const validators = {};
    Object.keys(this.schemaDefinition).forEach(key => {
      const { type } = this.schemaDefinition[key];
      switch (type) {
        case "number":
          validators[key] = new NumberValidator(this.schemaDefinition[key]);
          break;

        case "date":
          validators[key] = new DateValidator(this.schemaDefinition[key]);
          break;

        default:
          validators[key] = new StringValidator(this.schemaDefinition[key]);
      }
    });

    return validators;
  }
}

export default Schema;
