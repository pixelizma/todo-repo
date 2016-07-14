var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var todoNextId = 1;
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

	.use(bodyParser.json()) //middleware

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

	.post('/todos', function(req, res){
		var body = req.body;
		body.id = addAnId();
		body.completed = false;
		todos.push(body);
		res.json(body)
	})

	.listen(port, function(){
		console.log('Express listening on', port, ' !');
	});

	function addAnId(){
		return parseInt(todos[todos.length-1].id) + 1;
	}