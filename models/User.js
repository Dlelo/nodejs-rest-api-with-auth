var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username:{type:String, required:true, unique:true},
    password: { type: String, required: true},
    created_at:Date

});

module.exports = mongoose.model('User', userSchema);