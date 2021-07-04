const jwt = require('jsonwebtoken');
const AccessTokenSign = require('../models/AccessTokenSignModel');
const userRepository = require('../repositories/mongo/UserRepository');

exports.GenerateAccessToken = (username, email) => {
    let accessTokenSign = new AccessTokenSign();
    accessTokenSign.Username = username;
    accessTokenSign.Email = email;
    accessTokenSign.DateAt = Date.now();

    return jwt.sign(JSON.stringify(accessTokenSign), process.env.TOKEN_SECRET_KEY);
}

exports.VerifyAccessTokenAsync = async (accessToken) => {
    try
    {
        let user = await jwt.verify(accessToken, process.env.TOKEN_SECRET_KEY);
        if(user)
        {
            user = await userRepository.GetUserByEmailAsync(user.Email);
            if(user)
                return accessToken == user.AccessToken;
        }
    }
    catch {}

    return null;
}