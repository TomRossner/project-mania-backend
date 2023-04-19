const mongoose = require('mongoose');

// Message schema
const messageSchema = new mongoose.Schema({
    text: {type: String},
    date_sent: {type: Date, default: Date.now()},
    to: {type: Object},
    from: {type: Object},
    task: {type: Object}
})

// Message model
const Message = mongoose.model("Message", messageSchema);

// Exports
module.exports = {
    Message,
    messageSchema
}
