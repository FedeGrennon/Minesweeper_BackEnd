const { check } = require('express-validator');

exports.ValidCreateLobbyRequest = [
    check('UserId')
        .notEmpty(),
    check('MaxPlayers')
        .notEmpty()
        .isInt(),
    check('Password')
        .optional(),
    check('SocketId')
        .notEmpty() 
]