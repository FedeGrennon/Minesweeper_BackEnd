const { Schema, model } = require('mongoose');

const ChatSchema = new Schema (
    {
        Lobby: { type: Schema.Types.ObjectId, ref: "Lobby" },
        User: { type: Schema.Types.ObjectId, ref: "User" },
        Message: { type: String, require: true }
    },
    {
        timestamps: true
    }
)

module.exports = model('Chat', ChatSchema);