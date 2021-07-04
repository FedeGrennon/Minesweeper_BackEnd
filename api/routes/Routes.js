const userRoutes = require('./UserRoutes');
const lobbyRoutes = require('./LobbyRoutes');

module.exports = (app) => {
    userRoutes(app);
    lobbyRoutes(app);
};