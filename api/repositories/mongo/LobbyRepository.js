const baseRepository = require('./BaseRepository');
const LobbySchema = require('./schemas/LobbySchema');

exports.CreateLobbyAsync = async (lobby) => {
    baseRepository.ConnectToDb();
    
    let lobbySchema = new LobbySchema({
        SocketReference: lobby.SocketReference,
        PublicId: lobby.PublicId,
        MaxPlayers: lobby.MaxPlayers,
        Password: lobby.Password,
        Started: lobby.Started,
        Ended: lobby.Ended,
        GameSettings: lobby.GameSettings,
        Users: lobby.Users
    });

    try
    {
        await lobbySchema.save();
        return true;
    }
    catch(ex)
    {
        return false;
    }
}

exports.UserExistInLobbyAsync = async (UserId) => {
    baseRepository.ConnectToDb();
    let res = await LobbySchema.findOne({ 'Users.User': { _id: UserId }});
    return !!res;
}