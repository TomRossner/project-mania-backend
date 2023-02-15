const Joi = require("joi");

function validateRegistrationInputs(user) {
    const schema = Joi.object({
        first_name: Joi.string().min(2).max(255).required(),
        last_name: Joi.string().min(2).max(255).required(),
        email: Joi.string().min(6).max(255).email().required(),
        password: Joi.string().min(6).max(1024).required()
    });

    return schema.validate(user);
}

function validateLoginInputs(user) {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).email().required(),
        password: Joi.string().min(6).max(1024).required()
    });

    return schema.validate(user); 
}

module.exports = {
    validateRegistrationInputs,
    validateLoginInputs
}