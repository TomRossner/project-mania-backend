const Joi = require("joi");

// Validate new board
function validateBoard(board) {
    const schema = Joi.object({
        title: Joi.string().min(1).max(255).required()
    })

    return schema.validate(board);
}

// Validate new stage
function validateStage(stage) {
    const schema = Joi.object({
        stage_name: Joi.string().min(1).max(255).required()
    })

    return schema.validate(stage);
}

// Validate new task
function validateTask(task) {
    const schema = Joi.object({
        title: Joi.string().min(1).max(255).required(),
        project: Joi.object().required(),
        current_stage: Joi.object().required()
    })

    return schema.validate(task);
}

// Exports
module.exports = {
    validateBoard,
    validateStage,
    validateTask
}