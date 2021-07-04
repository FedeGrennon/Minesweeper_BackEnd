const { Schema, model } = require('mongoose');

const LogSchema = new Schema (
    {
        User: { type: Schema.Types.ObjectId, ref: "User" },
        Detail: { type: String, require: true },
        Severity: { type: String, require: true }
    },
    {
        timestamps: true
    }
)

module.exports = model('Log', LogSchema);