var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
//var Blog = require('../models/blog');
// Get Homepage

function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else
	{
		res.redirect('/');
	}
}
router.get('/register',function(req, res){
    	res.render('register');
});

router.get('/login',function(req, res){
    	res.render('login');
});
router.get('/dashboard',function(req, res){
    	res.render('dashboard');
});
router.get('/blogpost',function(req, res){
    	res.render('blogpost');
});
//register user
router.post('/register',function(req,res){
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var username = req.body.username;
	var password = req.body.password;
	var blogurl = req.body.blogurl;

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	}else{
		var newUser = new User({
			firstname:firstname,
			lastname:lastname,
			username:username,
			password:password,
			blogurl:blogurl
		});
		User.createUser(newUser,function(err,user){
			if(err) throw err;
			console.log(user);
		});
		req.flash('success_msg','You are successfully register');
		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
	passport.authenticate('local',{ successRedirect:'/users/dashboard', failureRedirect: '/users/login',
									 failureFlash: 'Username or password invalid, please check again'}),
	function(req,res){

});
router.get('/logout',function(req,res){
req.logout();
req.flash('success_msg','You are successfully logout');
res.redirect('/users/login');
});
module.exports = router;

// router.post('/dashboard', function(req, res) {
//   res.send(req.body);
// });

router.post('/blogpost', function(req, res) {
    var newtitle = req.body.title;
    var newcontent = req.body.content;
    var newPost = {
    	title : newtitle,
    	content : newcontent
    };
    var currUser = req.user;
  	User.createPost(currUser,newPost,function(err,result){
  		if(err) throw err;
  		console.log(currUser);
  		res.redirect('/users/dashboard');
  	})
  
});

router.put('/follow/:userName',ensureAuthenticated,function(req,res){
	var userToFollow = req.params.userName;
	var currUser = req.user;
	console.log(userToFollow);
	console.log(currUser);

	if(currUser.follow.indexOf(userToFollow) == -1){
		User.FollowUser(currUser,userToFollow,function(err,result){
			if(err) throw err;
			console.log(currUser);
			res.json("User "+currUser.firstname+" Follow User "+ userToFollow)
		});
	}
	else
		res.json("User Already Blocked");
	


});