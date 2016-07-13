var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: "Meet mom for lunch",
	completed: false
}, {
	id: 2,
	description: "Got to market!",
	completed: false
}];

app
	.get('/', function(req, res){
		res.send('Todo API Root');
	})
	.get('/todos', function(req, res){
		res.json(todos);
	})
	.get('/todos/:id', function(req, res){
		var id = parseInt(req.params.id, 10);

		todos.forEach(function(i){
			if (i.id === id) {
				res.json(i);
			};
		});

		res.status(404).send();
	})
	.listen(port, function(){
		console.log('Express listening on', port, ' !');
	});