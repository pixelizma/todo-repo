var crypt = require('password-hash');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7, 100]
			},
			set: function(value) {
				var salt = crypt.generate(value);

				this.setDataValue('password', salt)
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},
		classMethods: {
			auth: function(body) {
				return new Promise(function(resolve, reject) {

					if (typeof body.email !== 'string') {
						return reject();
					}

					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user) {
						if (!user) {
							return reject();
						}

						if (!crypt.verify(body.password, user.password)) {
							return reject();
						}

						resolve(user);

					}, function(err) {
						return reject();
					});

				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function(type){
				if (!_.isString(type)) {
					return undefined;
				}

				try{
					var stringData = JSON.stringify({id: this.get('id'), type: type});
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123').toString();
					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty');
					return token;
				}catch(e){
					console.error(e);
					return undefined;
				}
			}
		}
	});

	return user;
}