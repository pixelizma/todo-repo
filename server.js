var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
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
		var todoId = parseInt(req.params.id, 10);
		var matchedTodo = _.findWhere(todos, {id:todoId})
		if (matchedTodo) {
			res.json(matchedTodo);
		}else{
			res.status(404).send();
		}
	})

	.post('/todos', function(req, res){
		var body = _.pick(req.body, 'description');
		body.description = body.description.trim();
		body.id = addAnId();
		body.completed = false;
		if (!_.isBoolean(body.completed) || 
			!_.isString(body.description) ||
			body.description.trim().length === 0) {
			return res.status(400).send(body);
		}
		todos.push(body);
		res.json(body)
	})

	.listen(port, function(){
		console.log('Express listening on', port, ' !');
	});

	function addAnId(){
		return parseInt(todos[todos.length-1].id) + 1;
	}