var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app
	.get('/', function(req, res){
		res.send('Todo API Root');
	})
	.listen(port, function(){
		console.log('Express listening on', port, ' !');
	});