const Joi = require("joi");

// Validate new user inputs
function validateRegistrationInputs(user) {
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(255).required(),
        last_name: Joi.string().min(3).max(255).required(),
        email: Joi.string().min(6).max(255).email().required(),
        password: Joi.string().min(8).max(1024).required(),
        admin: Joi.bool(),
        base64_img_data: Joi.string(),
        img_url: Joi.string(),
        header: Joi.string()
    });

    return schema.validate(user);
}

// Validate user credentials
function validateLoginInputs(user) {
    const schema = Joi.object({
        email: Joi.string().min(6).max(255).email().required(),
        password: Joi.string().min(6).max(1024).required()
    });

    return schema.validate(user); 
}

// Exports
module.exports = {
    validateRegistrationInputs,
    validateLoginInputs
}