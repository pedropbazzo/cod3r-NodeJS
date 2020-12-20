const Joi = require('@hapi/joi');
const mapErrors = require('../../utils/mapErrors');
const extendSchema = require('../../utils/extendSchema');

const UserSchema = Joi.object().keys({
  name: Joi.string()
    .required()
    .error(mapErrors({ 'any.required': 'cannot to insert an user without name' })),
  mail: Joi.string()
    .required()
    .error(mapErrors({ 'any.required': 'cannot to insert an user without mail' })),
  passwd: Joi.string()
    .required()
    .error(mapErrors({ 'any.required': 'cannot to insert an user without passwd' })),
});

module.exports = extendSchema(UserSchema);
