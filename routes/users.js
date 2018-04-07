var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
// Get Homepage

router.get('/register',function(req, res){
    	res.render('register');
});

router.get('/login',function(req, res){
    	res.render('login');
});
router.get('/dashboard',function(req, res){
    	res.render('dashboard');
});

//register user
router.post('/register',function(req,res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	req.checkBody('password2','Password do not match').equals(req.body.password);
	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	}else{
		var newUser = new User({
			name:name,
			email:email,
			username:username,
			password:password
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