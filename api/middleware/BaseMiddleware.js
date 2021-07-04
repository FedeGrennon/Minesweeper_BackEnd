const { validationResult } = require('express-validator');
const TokenHelper = require('../Helpers/TokenHelper');

exports.ValidToken = async (req, res, next) => {
    let accessToken = req.headers['authorization'];
    if(!await TokenHelper.VerifyAccessTokenAsync(accessToken))
        return res.status(401).json('Unauthorized');
    
    next();
}

exports.ValidRequest = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(422).json(errors.array({ onlyFirstError: true }));
        
    next();
}