var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,
	undefined,
	undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/basic-sqlite-database.sqlite'
	});

var Todo = sequelize.define('todo', {
	description:{
		type: Sequelize.STRING,
		allowNull : false,
		validate : {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull : false,
		defaultValue: false
	}
})

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync().then(function(){
	console.log('Everything is synced');

	/*
	NOTLAR
		Model.add[Model](object)
		user.addTodo(todo);

		Model.get[Model]s(objects)
		user.getTodos(todos)

	*/

	User.findById(1).then(function(user){
		user.getTodos({
			where:{
				completed:false
			}
		}).then(function(todos){
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			})
		})
	})

	/*User.create({
		email:'selcuk.oguz@hotmail.com.tr'
	}).then(function(){
		return Todo.create({
			description: 'Clean yard!'
		});
	}).then(function(todo){
		User.findById(1).then(function(user){
			user.addTodo(todo);
		});
	});

	Todo.findById(2).then(function(todo){
		if (todo) {
			console.log(todo.toJSON());
		}else{
			console.log('empty');
		}
	});*/

	/*Todo.create({
		description: 'Boomer'
	}).then(function(todo){

		return Todo.create({
			description: 'Cleaner'
		})

	}).then(function(){
		//return Todo.findById(1);
		return Todo.findAll({
			where: {
				description: {
					$like: '%trash%'
				}
			}
		})
	}).then(function(todos){
		if (todos) {
			todos.forEach(function(todo){
				console.log(todo.toJSON());
			});
		}else{
			console.log('empty');
		}
	}).catch(function(err){
		console.log(err);
	})*/
});