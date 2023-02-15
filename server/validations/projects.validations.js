// const Joi = require("joi");

// function validateBoard(board) {
//     const schema = Joi.object({
//         title: Joi.string().min(1).max(255).required()
//     })

//     return schema.validate(board);
// }

// function validateStage(stage) {
//     const schema = Joi.object({
//         stage_name: Joi.string().min(1).max(255).required()
//     })

//     return schema.validate(stage);
// }

// function validateTask(task) {
//     const schema = Joi.object({
//         title: Joi.string().min(1).max(255).required(),
//         project: Joi.string().required(),
//         current_stage: Joi.string().required()
//     })

//     return schema.validate(task);
// }

// module.exports = {
//     validateBoard,
//     validateStage,
//     validateTask
// }