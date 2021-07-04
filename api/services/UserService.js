const userRepository = require('../repositories/mongo/UserRepository');
const CryptoHelper = require('../Helpers/CryptoHelper');
const TokenHelper = require('../Helpers/TokenHelper');
const UserModel = require('../models/UserModel');
const ResponseModel = require('../models/ResponseModel');

exports.LoginAsync = async ({ Email, Password }) => {
    let user = await userRepository.GetUserByEmailAsync(Email);

    if(user) {
        let isEqual = await CryptoHelper.CompareAsync(Password, user.Password);

        if(isEqual){
            let accessToken = TokenHelper.GenerateAccessToken(user.Username, user.Email);
            let response = await userRepository.UpdateAccessTokenUserAsync(Email, accessToken);

            if(response)
                return new ResponseModel(accessToken, 200);
            else
                throw new Error('Error when trying to login');
        }
    }

    return new ResponseModel(false, 401, 'Password or Email incorrect');
}

exports.RegisterAsync = async ({ Email, Password, Username }) => {
    let user = new UserModel();
    user.Email = Email;
    user.Username = Username;
    user.Password = await CryptoHelper.HashAsync(Password);

    let response = await userRepository.RegisterUserAsync(user);
    
    return new ResponseModel(response, 200);
}