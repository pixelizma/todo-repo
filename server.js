var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

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

.get('/', function(req, res) {
	res.send('Todo API Root');
})



.get('/todos', function(req, res) {
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
})



.get('/todos/:id', function(req, res) {
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
})



.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description');

	db.todo
		.create(body)
		.then(function(todo) {
			res.json(todo.toJSON());
		}).catch(function(err) {
			res.status(400).json(err);
		});
})



.delete('/todos/:id', function(req, res) {
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

	/*db.todo.findById(todoId).then(function(todo){
		if (!!todo) {

		}else{
			return res.status(400).send("There is not item for delete");
		}
	}, function(err){
		res.status(500).send();
	});*/

	/*var matchedTodo = _.findWhere(todos, {
		id: todoId
	});*/
	/*if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		return res.status(200).json(todos);
	} else {
		return res.status(400).send("There is not item for delete");
	}*/
})



.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});

	if (!matchedTodo) {
		return res.status(400).send();
	}

	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {}

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') &&
		_.isString(body.description) &&
		body.description.trim().length > 0) {
		validAttributes.description = body.description
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	}

	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo)
});


db.sequelize.sync().then(function() {
	app.listen(port, function() {
		console.log('Express listening on', port, ' !');
	});
});



function addAnId() {
	return parseInt(todos[todos.length - 1].id) + 1;
}