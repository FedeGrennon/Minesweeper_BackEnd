const { check } = require('express-validator');

exports.ValidLoginRequest = [
    check('Email')
        .isEmail()
        .normalizeEmail(),
    check('Password')
        .notEmpty()
]

exports.ValidRegisterRequest = [
    check('Email')
        .isEmail()
        .normalizeEmail(),
    check('Password')
        .isStrongPassword(),
    check('Username')
        .notEmpty()
        .isLength(6)
]