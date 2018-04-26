/* eslint-env jest */

import NumberValidator from "./number-validator";

describe("NumberValidator", () => {
  const fieldDefinition = {
    required: true,
    min: 2,
    max: 6
  };

  const fieldDefinitionWithCustomMessage = {
    required: true,
    min: 2,
    max: 6,
    prompt: "should be between 2 and 6"
  };

  const validator = new NumberValidator(fieldDefinition);
  const customMessageValidator = new NumberValidator(
    fieldDefinitionWithCustomMessage
  );

  const fields = {
    name: "Steve",
    age: 48
  };

  test("returns an empty array when a valid field value is used", () => {
    expect(validator.validate("5", fields)).toEqual([]);
  });

  test("returns an array of error messages for invalid values", () => {
    expect(validator.validate("1", fields)).toEqual([
      "should not be less than 2"
    ]);
    expect(validator.validate("8", fields)).toEqual([
      "should not be more than 6"
    ]);
  });

  test("returns a custom message when prompt is present and validation fails", () => {
    expect(customMessageValidator.validate("9", fields)).toEqual([
      "should be between 2 and 6"
    ]);
  });
});
