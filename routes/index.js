var express = require('express');
var router = express.Router();

// Get Homepage

router.get('/',function(req, res){
    	res.render('index');
});

/*router.get('/', function(req, res) {
    res.render('home', {layout: false});
});*/


module.exports = router;