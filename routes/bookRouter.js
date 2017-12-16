var express = require('express');

var bookRoutingFnctn = function (Book) {

    var booksAPIRouter = express.Router();
    booksAPIRouter.route('/')
        .get(function (req, res) {
            var filterQueryObj = {};
            if (req.query.genre) {
                filterQueryObj.genre = req.query.genre
            }
            Book.find(filterQueryObj, function (err, books) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    //handle the HATEOAS stuff
                    var returnedBooksArr = new Array();
                    books.forEach(function (element, index, array) {
                        var currBookElement = element.toJSON();
                        currBookElement.link = {};
                        currBookElement.link.self = 'http://' + req.headers.host + '/api/books/' + currBookElement._id;
                        returnedBooksArr.push(currBookElement);
                    });
                    res.json(returnedBooksArr);
                }
            })
        });

    booksAPIRouter.route('/').post(function (req, res) {
        // console.log(" Request body is ", req.body);
        var book = new Book(req.body);
        // console.log(" book is ", book);
        book.save();
        res.status(201).send(book);
    })

    //Introducing middleware to avoid getting book by id everytime
    booksAPIRouter.use('/:bookId', function (req, res, next) {
        Book.findById(req.params.bookId, function (err, book) {
            if (err) {
                res.status(500).send(err);
            } else if (book) {
                req.book = book;
                next();
            } else {
                res.status(404).send(' No book found ');
            }
        })
    });

    booksAPIRouter.route('/:bookId')
        .get(function (req, res) {
            res.json(req.book);
        })
        .put(function (req, res) {

            req.book.title = req.body.title;
            req.book.genre = req.body.genre;
            req.book.author = req.body.author;
            req.book.read = req.body.read;
            book.save();
            res.status(200).json(book);
        })
        .patch(function (req, res) {
            if (req.body._id) {
                delete req.body._id;
            }
            for (var key in req.body) {
                req.book[key] = req.body[key];
            }
            req.book.save(function (err) {
                if (err) res.status(500).send(err);
                else res.status(200).json(req.book);
            });
        })
        .delete(function (req, res) {
            req.book.remove(function (err) {
                if (err) res.status(500).send(err);
                else res.status(204).send(' Book Removed ');
            })
        });
    return booksAPIRouter;
}

module.exports = bookRoutingFnctn;