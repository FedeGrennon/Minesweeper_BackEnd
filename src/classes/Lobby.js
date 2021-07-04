class Lobby
{
    constructor(id, number, name, maxPlayers, users, isPrivate, password, userLider, roundConfiguration)
    {
        this.id = id;
        this.number = number;
        this.name = name;
        this.shortId = Math.floor((Date.now()));
        this.maxPlayers = maxPlayers;
        this.users = users;
        this.isPrivate = isPrivate;
        this.password = password;
        this.isStarted = false;
        this.userLider = userLider;
        this.gameMode;
        this.roundConfiguration = roundConfiguration;
    }
}

module.exports = Lobby;