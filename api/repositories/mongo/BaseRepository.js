const mongoose = require('mongoose');

exports.ConnectToDb = () => {
    mongoose.connect(process.env.DATABASE_URI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
}