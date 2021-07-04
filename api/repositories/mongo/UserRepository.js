const baseRepository = require('./BaseRepository');
const UserSchema = require('./schemas/UserSchema');

const UserModel = require('../../models/UserModel');

exports.RegisterUserAsync = async (user) => {
    baseRepository.ConnectToDb();

    let userSchema = new UserSchema({
        Username: user.Username,
        Password: user.Password,
        Email: user.Email
    });
    
    try
    {
        await userSchema.save();
        return true;
    }
    catch(ex)
    {
        return false;
    }
}

exports.UpdateAccessTokenUserAsync = async (Email, AccessToken) => {
    baseRepository.ConnectToDb();
    let res = await UserSchema.updateOne({ Email: Email }, { AccessToken: AccessToken });
    return res.nModified === 1;
}

exports.GetUserByEmailAsync = async (email) => {
    baseRepository.ConnectToDb();

    let res = await UserSchema.findOne({ Email: email });

    try
    {
        let user = new UserModel();
        user.Id = res._id;
        user.Username = res.Username;
        user.Password = res.Password;
        user.Email = res.Email;
        user.AccessToken = res.AccessToken;
    
        return user;
    }
    catch
    {
        return null;
    }
}

exports.GetUserByIdAsync = async (userId) => {
    baseRepository.ConnectToDb();

    let res = await UserSchema.findOne({ _id: userId });

    try
    {
        let user = new UserModel();
        user.Id = res._id;
        user.Username = res.Username;
        user.Password = res.Password;
        user.Email = res.Email;
        user.AccessToken = res.AccessToken;
    
        return user;
    }
    catch
    {
        return null;
    }
}