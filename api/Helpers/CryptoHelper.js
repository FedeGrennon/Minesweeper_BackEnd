const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

exports.HashAsync = async (plainText) => await bcrypt.hash(plainText, SALT_ROUNDS);
exports.CompareAsync = async (plainText, hash) => await bcrypt.compare(plainText, hash);