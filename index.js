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

var request = require('superagent');
var co = require('co');
var prompt = require('co-prompt');
var program = require('commander');


program
	.arguments('<file>')
	.action( function(file){
		co(function *(){

			var username = yield prompt('username : ');
			var password = yield prompt.password('password : ');

			console.log('user: %s pass: %s file: %s',
			username, password, file);

			request
				.post('https://api.bitbucket.org/2.0/snippets/')
				.auth(username, password)
				.attach('file', file)
				.set('Accept', 'application/json')
				.end(function (err, res){
					var link = res.body.links.html.href;
					console.log(chalk.green('Snippet created : %s', link));
				})
		});
	})
	.parse(process.argv);
