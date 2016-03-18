var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
    username : String,
    created_at : { type : Number, default : Date.now }
});

module.exports = mongoose.model('User', User);