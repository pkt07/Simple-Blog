var express = require('express');
var router = express.Router();
var User = require('../models/user');
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
module.exports = router;
