const { ValidRequest } = require('../middleware/BaseMiddleware');
const { ValidLoginRequest, ValidRegisterRequest } = require('../middleware/UserMiddleware');
const controller = require('../controllers/UserController');

module.exports = (app) => {
    app.route('/login')
        .post(ValidLoginRequest, ValidRequest, controller.Login);

    app.route('/register')
        .post(ValidRegisterRequest, ValidRequest, controller.Register);
};