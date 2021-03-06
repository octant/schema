/* eslint-env jest */

import Schema from "./schema";

describe("Schema", () => {
  const schemaDefinition = {
    dob: {
      type: "date",
      defaultValue: "2000-01-01",
      required: true,
      min: "1910-01-01",
      max: "2018-02-01"
    },
    firstName: {
      type: "text",
      required: true,
      min: 2,
      max: 20
    },
    lastName: {
      type: "text",
      required: true,
      min: 2,
      max: 25
    },
    numberOfVehicles: {
      type: "number",
      defaultValue: 1,
      min: 1
    }
  };

  const validator = new Schema(schemaDefinition);

  test("returns fields with default values applied", () => {
    expect(validator.defaultValues()).toEqual({
      dob: "2000-01-01",
      firstName: "",
      lastName: "",
      numberOfVehicles: 1
    });
  });

  test('returns "*" for all required fields with a value of ""', () => {
    const fields = {
      dob: "1985-03-02",
      firstName: "",
      lastName: "",
      numberOfVehicles: 1
    };
    expect(validator.validate(fields)).toEqual({
      firstName: "*",
      lastName: "*"
    });
  });

  test("check can be forced for all fields even if they are not a required field", () => {
    const fields = {
      dob: "1985-03-02",
      firstName: "Michael",
      lastName: "Wood"
    };
    expect(validator.validate(fields, true)).toEqual({
      numberOfVehicles: "missing from form"
    });
  });

  test("returns an empty object when all fields are valid", () => {
    const fields = {
      dob: "1985-03-02",
      firstName: "Michael",
      lastName: "Wood",
      numberOfVehicles: 1
    };
    expect(validator.validate(fields)).toEqual({});
    expect(validator.isValid(fields)).toBe(true);
  });

  test("fails validation when a required field is missing", () => {
    const fields = {
      dob: "1985-03-02",
      firstName: "Michael",
      numberOfVehicles: 33
    };
    expect(validator.validate(fields)).toEqual({
      lastName: "missing from form"
    });
  });

  test("returns errors for all failed validations", () => {
    const fields = {
      dob: "1909-03-02",
      firstName: "M",
      numberOfVehicles: 0
    };

    expect(validator.validate(fields)).toEqual({
      numberOfVehicles: "should not be less than 1",
      firstName: "should be no shorter than 2 characters",
      lastName: "missing from form",
      dob: "should be no earlier than 1910-01-01"
    });
  });
});
