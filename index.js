#!/usr/bin/env node

const chalk = require('chalk');

console.log(chalk.blue('Snippet!'));

var fs = require('fs');
var ProgressBar = require('progress');
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

			var fileContents;
			try {
			  fileContents = fs.readFileSync(file);
			} catch (err) {
				if (err.code === 'ENOENT') {
				  console.log(chalk.bold.red('File not found!'));
				} else {
				  throw err;
				}
			}

			var fileSize = fs.statSync(file).size;
			var fileStream = fs.createReadStream(file);

			var barOpts = {
				width : 20,
				total : fileSize,
				clear : true
			}

			var bar = new ProgressBar('Uploading [:bar] :percent :etas', barOpts);

			fileStream.on('data', function(chunk){
				bar.tick(chunk.length);
			});

			request
				.post('https://api.bitbucket.org/2.0/snippets/')
				.auth(username, password)
				.attach('file', fileStream)
				.set('Accept', 'application/json')
				.end(function (err, res){
					if(!err && res.ok){
						var link = res.body.links.html.href;
						console.log(chalk.bold.cyan('Snippet created: ', link));
					}

					var errorMessage;
					if(res  && res.status === 401){
						errorMessage = "Authenication failed! Bad username/ password";
					} else if(err) {
						errorMessage = err;
					}
					else{
						errorMessage = res.text;
					}
					console.error(chalk.red(errorMessage));
					process.exit(1);
				})
		});
	})
	.parse(process.argv);
