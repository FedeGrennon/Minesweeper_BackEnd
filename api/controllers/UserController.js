const service = require('../services/UserService');
const ResponseModel = require('../models/ResponseModel');

exports.Login = async (req, res) => {
    try
    {
        const response = await service.LoginAsync(req.body);
        res.status(response.StatusCode).json(response);
    }
    catch(ex)
    {
        let response = new ResponseModel(null, 500, ex.message);
        res.status(response.StatusCode).json(response);
    }
}

exports.Register = async (req, res) => {
    try
    {
        const response = await service.RegisterAsync(req.body);
        res.status(response.StatusCode).json(response);
    }
    catch(ex)
    {
        let response = new ResponseModel(null, 500, ex.message);
        res.status(response.StatusCode).json(response);
    }
}