const mongoose = require('mongoose');

// Message schema
const messageSchema = new mongoose.Schema({
    text: {type: String},
    sent_at: {type: Date, default: Date.now},
    to: {type: String},
    from: {type: String}
})

// Message model
const Message = mongoose.model("Message", messageSchema);

// Exports
module.exports = {
    Message,
    messageSchema
}
