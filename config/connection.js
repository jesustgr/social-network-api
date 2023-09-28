const mongoose = require('mongoose'); 
mongoose.connect('mongodb://localhost:27017/socialDB');      
module.exports = mongoose.connection;  