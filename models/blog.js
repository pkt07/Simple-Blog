var mongoose = require('mongoose');


var PostSchema = mongoose.Schema({
  name: 'Post',
  properties: {
    timestamp: 'date',
    title: 'string',
    content: 'string'
  }
});

var Blog = module.exports = mongoose.model('Blog', PostSchema);
module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	Blog.findOne(query, callback);
}