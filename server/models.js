
const mongoose = require("mongoose");
const {defaultStages} = require("./defaultProperties");

const messageSchema = new mongoose.Schema({
    text: {type: String},
    date_sent: {type: Date, default: Date.now()},
    to: {type: Object},
    from: {type: Object},
    task: {type: Object}
})
const Message = mongoose.model("Message", messageSchema);



const taskSchema = new mongoose.Schema({
    created_at: {type: Date, default: new Date()},
    current_stage: {type: String},
    project: {type: String},
    title: {type: String, default: "New Task"},
    due_date: {type: Date, default: new Date().toDateString()},
    isDone: {type: Boolean, default: false},
    edit_active: {type: Boolean, default: false},
    files: {type: Array},
    messages: {type: [messageSchema]},
    priority: {type: String, default: 'Low'}
})
const Task = mongoose.model("Task", taskSchema);



const stageSchema = new mongoose.Schema({
    stage_name: {type: String, default: "New Stage"},
    description: {type: String},
    stage_tasks: {type: [taskSchema]},
    created_at: {type: Date, default: new Date()},
    edit_active: {type: Boolean, default: false},
    options_menu_open: {type: Boolean, default: false},
    tasks_done: {type: Number, default: 0}
})
const Stage = mongoose.model("Stage", stageSchema);



const boardSchema = new mongoose.Schema({
    created_at: {type: Date, default: new Date()},
    stages: {type: [stageSchema],  default: [...defaultStages]},
    members: {type: Array},
    due_date: {type: Date, default: new Date().toDateString()},
    title: {type: String, default: "New Board"},
    subtitle: {type: String},
    edit_active: {type: Boolean, default: false},
    options_menu_open: {type: Boolean, default: false},
    notifications: {type: Array}
}, {collection: 'boards'})
const Board = mongoose.model("Board", boardSchema);



const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    created_at: {type: Date, default: new Date()},
    last_login: {type: Date, default: Date.now()},
    notifications: {type: Array},
    is_admin: {type: Boolean, default: false}
}, {collection: 'users'})
const User = mongoose.model("User", userSchema);




module.exports = {
    User,
    Board,
    Stage,
    Task,
    Message
}