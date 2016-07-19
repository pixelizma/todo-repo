var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var crypt = require('password-hash');

var app = express();
var port = process.env.PORT || 3000;
var todoNextId = 1;
var todos = [{
	id: 1,
	description: "Meet mom for lunch",
	completed: true
}, {
	id: 2,
	description: "Got to market!",
	completed: true
}];

app.use(bodyParser.json()) //middleware

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.trim().length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(err) {
		res.status(500).send();
	});
});

app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send();
		}
	}, function(err) {
		res.status(500).send();
	});
});

app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description');

	db.todo
		.create(body)
		.then(function(todo) {
			res.json(todo.toJSON());
		}).catch(function(err) {
			res.status(400).json(err);
		});
});

app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(number) {
		if (number <= 0) {
			res.status(404).json({
				error: 'There is no TODO for delete'
			});
		} else {
			res.status(204).send();
		}
	}, function(err) {
		res.status(500).send(err.message);
	});
});

app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {}

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description
	} 

	db.todo.findById(todoId).then(function(todo){
		if (todo) {
			return todo.update(attributes);
		}else{
			res.status(404).send();
		}
	}, function(){
		res.status(500).send();

	}).then(function(todo){
		res.json(todo.toJSON());
	}, function(err){
		res.status(400).send(err);
	});
});



//USER WORKS
app.post('/users', function(req, res){
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function(user){
		res.json(user.toPublicJSON());
	}, function(e){
		res.status(400).json(e);
	})
});

app.post('/users/login', function(req, res){
	var body = _.pick(req.body, 'email', 'password');

	db.user.auth(body).then(function(user){
		res.json(user.toPublicJSON());
	}, function(e){
		res.status(401).send();
	});
});



db.sequelize.sync().then(function() {
	app.listen(port, function() {
		console.log('Express listening on', port, ' !');
	});
});



function addAnId() {
	return parseInt(todos[todos.length - 1].id) + 1;
}