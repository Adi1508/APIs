var mongoose=require('mongoose');
var Schema = mongoose.Schema;

var apiSchema = new Schema({
	name : String
});

module.exports = mongoose.model('Test', apiSchema);