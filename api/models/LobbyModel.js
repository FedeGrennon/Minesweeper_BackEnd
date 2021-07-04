module.exports = class Lobby
{
    constructor()
    {
        this.SocketReference;
        this.PublicId;
        this.MaxPlayers;
        this.Password;
        this.Started;
        this.Ended;
        this.GameSettings;
        this.Users;
    }
}