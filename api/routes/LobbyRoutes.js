const { ValidRequest, ValidToken } = require('../middleware/BaseMiddleware');
const { ValidCreateLobbyRequest } = require('../middleware/LobbyMiddleware');
const controller = require('../controllers/LobbyController');

module.exports = (app) => {
    app.route('/lobby/create')
        .post(ValidCreateLobbyRequest, ValidRequest, controller.CreateLobby);
};