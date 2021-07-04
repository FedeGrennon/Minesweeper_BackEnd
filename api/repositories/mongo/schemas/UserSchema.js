const { Schema, model } = require('mongoose');

const UserSchema = new Schema (
    {
        Username: { type: String, require: true },
        Password: { type: String, require: true },
        Email: { type: String, require: true, unique: true },
        AccessToken: { type: String, default: '' }
    }, 
    {
        timestamps: true
    }
)

module.exports = model('User', UserSchema);