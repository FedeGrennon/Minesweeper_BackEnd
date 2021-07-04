const User = require('./User');

class RoundUser extends User
{
    constructor(user)
    {
        super(user.id, user.name, user.socketId);
        this.end = false;
        this.lose = false;
        this.percentageComplete = 0;
        this.points = 0;
        this.timeInMilliseconds = 0;
    }
}

module.exports = RoundUser;