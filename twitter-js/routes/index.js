'use strict';
var express = require('express');
var router = express.Router();
// var tweetBank = require('../tweetBank');

module.exports = function makeRouterWithSockets(io, client) {

	// a reusable function



	function respondWithAllTweets(req, res, next) {
		client.query("SELECT * FROM tweets INNER JOIN users ON users.id=tweets.userid", function (err, result) {
			var tweets = result.rows;
			res.render('index', {
				title: 'Twitter.js',
				tweets: tweets,
				showForm: true
			});
		});
	}

	// here we basically treet the root view and tweets view as identical
	router.get('/', respondWithAllTweets);
	router.get('/tweets', respondWithAllTweets);


	// // single-user page
	router.get('/users/:username', function (req, res, next) {
		var tweetsForName = client.query("SELECT * FROM tweets INNER JOIN users ON users.id=tweets.userid WHERE name = $1", [req.params.username], function (err, result) {
			var tweets = result.rows;
			res.render('index', {
				title: 'Twitter.js',
				tweets: tweets,
				showForm: true
			});
		})
	});
	//
	// single-tweet page
	router.get('/tweets/:id', function (req, res, next) {
		var tweetsForName = client.query("SELECT * FROM tweets INNER JOIN users ON users.id=tweets.userid WHERE tweets.id = $1", [req.params.id], function (err, result) {
			var tweets = result.rows;
			res.render('index', {
				title: 'Twitter.js',
				tweets: tweets,
				showForm: true
			});
		})
	});
	//
	// create a new tweet
	router.post('/tweets', function (req, res, next) {
		// var newTweet = tweetBank.add(req.body.name, req.body.text);
		// io.sockets.emit('new_tweet', newTweet);
		// res.redirect('/');
		var user_Id;
		client.query("SELECT id FROM users WHERE name = $1", [req.body.name], function (err, result) {
			user_Id = result.rows[0].id;
		})
		client.query('INSERT INTO tweets (userId, content) VALUES ($1, $2)', [user_Id, req.body.text], function () {
			console.log("added!");
		});
		client.query("SELECT * FROM tweets INNER JOIN users ON users.id=tweets.userid", function (err, result) {
			console.log(result.rows);
		});

	});



	// // replaced this hard-coded route with general static routing in app.js
	// router.get('/stylesheets/style.css', function(req, res, next){
	//   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
	// });

	return router;
}
