function extendSchema(schema) {
  const newSchema = schema;

  newSchema.simpleValidate = (obj) => {
    const { error, value } = schema.validate(obj);

    if (error) {
      return { error: error.details[0], value };
    }

    return { error, value };
  };

  return newSchema;
}

module.exports = extendSchema;
