var Promise = require('bluebird');
var db = require('./server/db');
const chalk = require('chalk');
var User = require('./server/db/models/user');

var users = [{
  email: 'admin@admin.com',
  isAdmin: true,
  password: 'admin',
  first_name: 'Admin',
  last_name: 'Mcadminson'
}, {
  email: 'user@user.com',
  isAdmin: false,
  password: 'user',
  first_name: 'User',
  last_name: 'Mcuserson'
}];

var creationPromises = [];

users.forEach(user => creationPromises.push(User.create(user)))

db.sync()
  .then(() => {
    return Promise.all(creationPromises)
  })
  .then(createdAll => {
    console.log(chalk.green('Database seeded!'));
  })
  .catch(function (err) {
    console.error(err)
  })
  .finally(() => {
    db.close(); // else, connection held ~10 secs. Does not return a promise.
  })