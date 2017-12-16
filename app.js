var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

var mongooseDB = mongoose.connect('mongodb://localhost/booksAPI');

//referencing our mongoose model
var Book = require('./models/bookModel');

var booksAPIRouter  = require('./routes/bookRouter')(Book);


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/api/books', booksAPIRouter);

app.get('/', function (req, res) {
    res.send('Welcome to the REST node API v1.0');
});

app.listen(port, function () {
    console.log(' Running on port : ' + port);
})