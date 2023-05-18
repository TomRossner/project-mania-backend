const mongoose = require('mongoose');

// Message schema
const messageSchema = new mongoose.Schema({
    text: {type: String},
    sent_at: {type: Date, default: Date.now},
    to: {type: String},
    from: {type: String},
    seen: {type: Boolean, default: false}
})

// Message model
const Message = mongoose.model("Message", messageSchema);

// Exports
module.exports = {
    Message,
    messageSchema
}
