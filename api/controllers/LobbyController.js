const service = require('../services/LobbyService');
const ResponseModel = require('../models/ResponseModel');

exports.CreateLobby = async (req, res) => {
    try
    {
        const response = await service.CreateLobbyAsync(req.body);
        res.status(response.StatusCode).json(response);
    }
    catch(ex)
    {
        let response = new ResponseModel(null, 500, ex.message);
        res.status(response.StatusCode).json(response);
    }
}