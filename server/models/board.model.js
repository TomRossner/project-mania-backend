const mongoose = require('mongoose');
const {defaultStages} = require("../defaultProperties");
const {stageSchema} = require('./stage.model');

// Board schema
const boardSchema = new mongoose.Schema({
    created_at: {type: Date, default: new Date()},
    stages: {type: [stageSchema],  default: [...defaultStages]},
    members: {type: Array},
    due_date: {type: Date, default: new Date().toDateString()},
    title: {type: String, default: "New Board"},
    subtitle: {type: String},
    edit_active: {type: Boolean, default: false},
    options_menu_open: {type: Boolean, default: false},
    notifications: {type: Array},
    admins: {type: Array},
    admin_pass: {type: String, default: process.env.PROJECT_ADMIN_PASS},
    activity: {type: Array}
}, {collection: 'boards'})

// Board model
const Board = mongoose.model("Board", boardSchema);

// Exports
module.exports = {
    Board,
    boardSchema
}