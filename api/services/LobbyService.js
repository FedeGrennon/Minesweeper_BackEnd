const lobbyRepository = require('../repositories/mongo/LobbyRepository');
const userRepository = require('../repositories/mongo/UserRepository');
const { v4: uuidv4 } = require('uuid');
const LobbyModel = require('../models/LobbyModel');
const UserLobby = require('../models/UserLobbyModel');
const GameSettingsModel = require('../models/GameSettingsModel');
const ResponseModel = require('../models/ResponseModel');
const GameStatsModel = require('../models/GameStatsModel');

exports.CreateLobbyAsync = async ({ UserId, MaxPlayers, Password, SocketId }) => {
    if(!await userRepository.GetUserByIdAsync(UserId))
        throw new Error('User not found');

    if(await lobbyRepository.UserExistInLobbyAsync(UserId))
        throw new Error('User is in a lobby');

    let lobby = GetLobbyModel(UserId, MaxPlayers, Password, SocketId);
    let response = await lobbyRepository.CreateLobbyAsync(lobby);
    
    return new ResponseModel(response, 200);
}

const GetLobbyModel = (userId, maxPlayers, password, socketId) => {
    let lobby = new LobbyModel();
    lobby.SocketReference = uuidv4();
    lobby.PublicId = uuidv4();
    lobby.MaxPlayers = maxPlayers;
    lobby.Password = password;
    lobby.GameSettings = new GameSettingsModel();
    lobby.Users = [];

    let user = new UserLobby();
    user.User = userId;
    user.GameStats = new GameStatsModel();
    user.LobbyBoss = true;
    user.SocketId = socketId;

    lobby.Users.push(user);

    return lobby;
}