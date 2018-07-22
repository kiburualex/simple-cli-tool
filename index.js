#!/usr/bin/env node

const chalk = require('chalk');

console.log(chalk.blue('Snippet!'));

// var figlet = require('figlet');

// figlet('Snippet Application', function(err, data) {
//     if (err) {
//         return;
//     }
//     console.log(data)
// });

var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');


program
	.arguments('<file>')
	.option('-u --username <username>', 'The user authenticates as')
	.option('-p --password <password>', 'The user password')
	.action( function(file){
		co(function *(){

			var username = yield prompt('username : ');
			var password = yield prompt.password('password : ');

			console.log('user: %s pass: %s file: %s',
			username, password, file);
		});
	})
	.parse(process.argv);
