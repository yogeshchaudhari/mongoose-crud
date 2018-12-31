const express = require('express');
const errorHandler = require('errorhandler');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const { Schema, model } = mongoose;
const app = express();

app.use(bodyParser.json());
app.use(logger('dev'));

const url = 'mongodb://localhost:27017/edx';
mongoose.connect(url, { useNewUrlParser: true });

const accountSchema = Schema({
	name: String,
	balance: Number
});

const Account = model('Account', accountSchema);

app.get('/account', (req, res) => {
	Account
	  .find({})
	  .exec((error, accounts) => {
	  	if(error){
	  		res.status(401).send('Database problem');
	  	} else {
			res.send(accounts);
	  	}
	  });
});
app.post('/account', (req, res) => {
	const account = new Account(req.body);
	account.save((error, result) => {
		if(error){
	  		res.status(401).send('Database problem');
	  	} else {
	  		res.send(result);
	  	}
	})
});
app.patch('/account/:id', (req, res) => {
	const query = { _id: mongoose.Types.ObjectId(req.params.id) };
	const update = req.body;

	Account.findOneAndUpdate(query, update, (error, result) => {
		if(error){
	  		res.status(401).send('Database problem');
	  	} else {
	  		res.send(result);
	  	}
	  });
});
app.delete('/account/:id', (req, res) => {
	Account.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.params.id) }, (error, result) => {
		if(error){
	  		res.status(401).send('Database problem');
	  	} else {
	  		res.send(result);
	  	}
	})
});

app.listen(3000, () => {
	console.log('Server started on port 3000');
});
