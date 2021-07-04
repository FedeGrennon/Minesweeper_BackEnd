const { Schema, model } = require('mongoose');

const LobbySchema = new Schema (
    {
        SocketReference: { type: String, require: true, unique: true },
        PublicId: { type: String, require: true, unique: true },
        MaxPlayers: { type: Number, default: 4 },
        Password: { type: String, default: '' },
        Started: { type: Boolean, default: false },
        Ended: { type: Boolean, default: false },
        GameSettings: {
            Time: { type: Number, default: 60000 },
            NumberBombs: { type: Number, default: 5 },
            BombsDistribution: { type: Array, default: [] },
            GridDimensions: {
                Height: { type: Number, default: 5 },
                Width: { type: Number, default: 5 }
            }
        },
        Users: [
            {
                User: { type: Schema.Types.ObjectId, ref: "User" },
                SocketId: { type: String, require: true },
                LobbyBoss: { type: Boolean, require: true },
                GameStats: {
                    End: { type: Boolean, default: false },
                    Win: { type: Boolean, default: false },
                    Percentage: { type: Number, default: 0 },
                    Points: { type: Number, default: 0 },
                    Time: { type: Number, default: 0 }
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = model('Lobby', LobbySchema);