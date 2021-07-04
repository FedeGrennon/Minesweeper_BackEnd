//Socket o v2.0 agrupamiento de sockets
const { v4: uuidv4 } = require('uuid');
const Lobby = require('../classes/Lobby.js');
const RoundConfiguration = require('../classes/RoundConfiguration.js');
const RoundUser = require('../classes/RoundUser.js');
const User = require('../classes/User.js');

let lobbys = [];
let users = [];

Messages = (socket, io) =>
{
  socket.on('newUser', (data) => 
  {
    //data = userName = 'Pedro'
    let user = CreateUser(data, socket.id);
    user ? socket.emit('connectOk', JSON.stringify(user)) : socket.emit('connectError');
  });

  socket.on('createLobby', (data) => 
  {
    //data = "{\"userId\":\"0e01ae65-ecd2-4b10-9452-5af237440fa7\",\"password\":\"asd\", \"maxPlayers\":2}";
    let lobby = CreateLobby(JSON.parse(data));
    
    if(lobby)
    {
      socket.join(lobby.name);
      socket.emit('lobbyCreatedOk', JSON.stringify(lobby));
    }
    else
    socket.emit('lobbyCreatedError');
  });

  socket.on('joinLobby', (data) => 
  {
    //data = "{\"id\":\"0e01ae65-ecd2-4b10-9452-5af237440fa7\",\"shortId\":1588992044141}";
    let result = JoinLobby(JSON.parse(data));

    switch(result)
    {
      case 0: //Unexpected error
        socket.emit('joinLobbyError');
      break;
      case 1: //The lobby doesn't exist
        socket.emit('joinLobbyNotExist');
      break;
      case 2: //The game is started
        socket.emit('joinLobbyIsStarted');
      break;
      case 3: //The lobby is full
        socket.emit('joinLobbyIsFull');
      break;
      case 4: //Password incorrect
        socket.emit('joinLobbyPasswordError');
      break;
      default: //Not problems
        socket.join(result.name);
        socket.emit('joinLobbyOk', JSON.stringify(result));
        socket.to(result.name).emit('updateLobby', JSON.stringify(result));
      break;
    }
  });

  socket.on('searchGame', (data) => 
  {
    //data = "asd5694-asdas-156kk-dbdf"
    console.log('user:', data, 'Searching Game');
    let lobby = SearchGame(data);

    setTimeout(() => {
      if(lobby)
      {
        socket.join(lobby.name);
        socket.emit('joinLobbyOk', JSON.stringify(lobby));
        socket.to(lobby.name).emit('updateLobby', JSON.stringify(lobby));
      }
      else
      {
        socket.emit('noLobbyAvailable');
      }
    }, 1000);
  });

  socket.on('sendMessage', (data) => 
  {
    //data = "{\"userId\":\"asd5694-asdas-156kk-dbdf\",\"lobbyId\":\"asd5694-asdas-156kk-dbdf\",\"message\":\"mensajitoss\"}"
    let result = ProcessMessage(JSON.parse(data));

    if(result)
      io.in(result.name).emit('userSendMessage', JSON.stringify(result));
  });

  socket.on('kickPlayer', (data) => 
  {
    //data = "{\"lobbyId\":\"asd5694-asdas-156kk-dbdf\",\"userLiderId\":\"asd5694-asdas-156kk-dbdf\",\"userKickId\":\"asd5694-asdas-156kk-dbdf\"}"
    let result = KickPlayer(JSON.parse(data));

    if(result)
    {
      io.in(result.lobby.name).emit('updateLobby', JSON.stringify(result.lobby));
      io.to(result.userSocketId).emit('userKicking');
      io.sockets.connected[result.userSocketId].leave(result.lobby.name);
    }
  });

  socket.on('updateOptionsLobby', (data) => 
  {
    let lobby = UpdateLobby(JSON.parse(data));

    if(lobby)
      io.in(lobby.name).emit('updateLobby', JSON.stringify(lobby));
  })

  socket.on('leftLobby', (data) => 
  {
    let lobby = UserLeftLobby(JSON.parse(data));

    if(lobby)
    {
      socket.to(lobby.name).emit('updateLobby', JSON.stringify(lobby));
      socket.leave(lobby.name);
    }
  });

  socket.on('disconnect', (data) => 
  {
    let lobby = DisconectUser(socket.id);

    if(lobby)
    {
      socket.to(lobby.name).emit('updateLobby', JSON.stringify(lobby));
      socket.leave(lobby.name);
    }
  });

  socket.on('playGame', (data) =>
  {
    let lobby = PlayGame(JSON.parse(data));
    io.in(lobby.name).emit('playGame', JSON.stringify(lobby));
  });

  socket.on('refreshUserGame', (data) =>
  {
    let lobby = RefreshUserGame(JSON.parse(data));
    io.in(lobby.name).emit('refreshUserGame', JSON.stringify(lobby.users));
  });
}

const CreateUser = (userName, socketId) =>
{
  try
  {
    if(!userName) throw Error('The username is empty');

    let user = new User(uuidv4(), userName, socketId);
    users.push(user);
    console.log('Create new user:', user);
    return user;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - CreateUser - Error to create User. Exception:', ex.message);
    return false;
  }
}

const CreateLobby = ({ userId, password, maxPlayers }) =>
{
  try
  {
    let user = users.find(x => x.id == userId);
    if (!user) 
      throw Error('The user doesn´t exist');

    let lobbyUsers = [];
    let userRound = new RoundUser(user);
    lobbyUsers.push(userRound);
    
    let lobbyNumber = lobbys.length + 1;
    let roundConfiguration = new RoundConfiguration(5, 5, 5, 60000);
    let lobby = new Lobby(uuidv4(), lobbyNumber, uuidv4(), maxPlayers, lobbyUsers, !!password, password, user.id, roundConfiguration);
    lobbys.push(lobby);
    
    console.log('Create new lobby:', lobby);
    return lobby;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - CreateLobby - Error to create Lobb. Exception:', ex.message);
    return false;
  }
}

const JoinLobby = ({ shortId: lobbyShortId, userId, password }) =>
{
  try
  {
    let lobby = lobbys.find(x => x.shortId == lobbyShortId);
    let user = users.find(x => x.id == userId);

    if(!user)
      throw Error('The user doesn´t exist');
    if(!lobby) 
      return 1; //The lobby doesn't exist
    if(lobby.isPrivate && lobby.password !== password)
      return 4; //Password incorrect
    if(lobby.maxPlayers === lobby.users.length)
      return 3; //The lobby is full
    if(lobby.isStarted)
      return 2; //The game is started
    
    lobby.users.push(new RoundUser(user));
    console.log('New user join lobby:', lobby);
    return lobby;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - JoinLobby - Error to join lobby. Exception:', ex.message);
    return 0; //Unexpected error
  }
}

const UpdateLobby = ({ lobbyId, userId, gameMode, password, roundConfiguration }) =>
{
  try
  {
    let lobby = lobbys.find(x => x.id === lobbyId);

    if(lobby.userLider === userId)
    {
      lobby.roundConfiguration = roundConfiguration;
      lobby.gameMode = gameMode;
      lobby.password = password;
      lobby.isPrivate = !!password;

      lobby.roundConfiguration.timeToEnd *= 1000;

      console.log('Updating lobby options:', lobby.roundConfiguration);
      return lobby;
    }

    return false;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - UpdateLobby - Error to update lobby. Exception:', ex.message);
    return false;
  }
}

const KickPlayer = ({ lobbyId, userLiderId, userKickId }) =>
{
  try
  {
    let lobby = lobbys.find(x => x.id === lobbyId);
    
    if(lobby.userLider === userLiderId)
    {
      let indexUser = lobby.users.findIndex(x => x.id === userKickId);
      lobby.users.splice(indexUser, 1);

      let userKick = users.find(x => x.id === userKickId);

      let result = { lobby, userSocketId: userKick.socketId };
      console.log('User kick:', result);
      return result;
    }

    return false;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - KickPlayer - Error to kick user. Exception:', ex.message);
    return false;
  }
}

const UserLeftLobby = ({ lobbyId, userId }) =>
{
  try
  {
    let lobby = lobbys.find(x => x.id === lobbyId);

    let indexUser = lobby.users.findIndex(x => x.id === userId);
    lobby.users.splice(indexUser, 1);

    if(lobby.users.length === 0)
    {
      let indexLobby = lobbys.findIndex(x => x.id === lobby.id);
      lobbys.splice(indexLobby, 1);
    }
    else
        lobby.userLider = lobby.users[0].id;
    
    console.log('User Left lobby:', lobby);
    return lobby;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - UserLeftLobby - Error to left user. Exception:', ex.message);
    return false;
  }
}

const SearchGame = (userId) =>
{
  try
  {
    let lobby = lobbys.find(x => !x.isPrivate && x.users.length < x.maxPlayers && !x.isStarted);

    if(lobby)
    {
      let user = users.find(x => x.id === userId);
      lobby.users.push(new RoundUser(user));

      console.log('New user join lobby:', lobby);
      return lobby;
    }
    else
      return false;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - SearchGame - Error to join lobby. Exception:', ex.message);
    return false;
  }
}

const ProcessMessage = ({ userId, lobbyId, message }) =>
{
  try
  {
    let lobby = lobbys.find(x => x.id === lobbyId);
    let user = lobby.users.find(x => x.id === userId);

    let result = { name: lobby.name, userName: user.name, message, userId };
    console.log('Process message:', result);
    return result;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - ProcessMessage - Error to process message. Exception:', ex.message);
    return false;
  }
}



const PlayGame = ({ lobbyId, userId }) =>
{
  try
  {
    let lobby = lobbys.find(x => x.id === lobbyId);
    if(lobby.userLider === userId && !lobby.isStarted)
    {
      lobby.isStarted = true;

      let mines = [];
      let cells = lobby.roundConfiguration.gridHeigth * lobby.roundConfiguration.gridWidth;

      for(let i = 0; i < lobby.roundConfiguration.mineCount; i++)
      {
          let randomNumber = Math.floor(Math.random() * cells);
          while(mines.some(x => x == randomNumber))
              randomNumber = Math.floor(Math.random() * cells);
          mines.push(randomNumber);
      }

      lobby.roundConfiguration.randomMines = mines;

      console.log('User play game:', lobby);
      return lobby;
    }
    
    return false;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - PlayGame - Error to play game. Exception:', ex.message);
    return false;
  }
}

const RefreshUserGame = ({ points, userId, lobbyId, percentage, timeInMilliseconds, endGame }) =>
{
  try
  {
    let lobby = lobbys.find(x => x.id === lobbyId);
    let user = lobby.users.find(x => x.id === userId);
    user.points = points;
    user.percentageComplete = percentage;
    user.end = endGame;
    user.timeInMilliseconds = timeInMilliseconds;

    lobby.users.sort((a, b) =>
    {
      return b.points - a.points ||
             a.timeInMilliseconds - b.timeInMilliseconds;
    });

    console.log('RefreshUserGame:', user);
    return lobby;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - RefreshUserGame - Error to add points. Exception:', ex.message);
    return false;
  }
}

const DisconectUser = (socketId) =>
{
  try
  {
    let user = users.find(x => x.socketId === socketId);
    let lobby = lobbys.find(x => x.users.find(y => y.socketId === socketId));

    if(user)
    {
      let indexUser = users.findIndex(x => x.id === user.id);
      users.splice(indexUser, 1);
    }

    if(lobby)
    {
      let indexUser = lobby.users.findIndex(x => x.socketId === socketId);
      lobby.users.splice(indexUser, 1);

      if(lobby.users.length === 0)
      {
        let indexLobby = lobbys.findIndex(x => x.id === lobby.id);
        lobbys.splice(indexLobby, 1);
      }
      else
        lobby.userLider = lobby.users[0].id;
    }

    console.log('User disconect:', lobby);
    return lobby;
  }
  catch(ex)
  {
    console.log('SocketMessageManager - DisconectUser - Error to disconect user. Exception:', ex.message);
    return false;
  }
}

module.exports = { Messages };