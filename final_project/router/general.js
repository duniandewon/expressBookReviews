const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return res.status(200).json({
    status: res.statusCode,
    message: "GET books successfull",
    books,
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]

  if (!book) {
    return res.status(404).json({
      status: res.statusCode,
      message: "Book was not found",
    });
  }

  return res.status(200).json({
    status: res.statusCode,
    message: "GET book successfull",
    book: book,
  });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author.split("-").join(" ").toLocaleLowerCase()

  let booksByAuthor = [];

  for (const isbn in books) {
    if (Object.hasOwnProperty.call(books, isbn)) {
      const book = books[isbn];

      if (book.author.toLowerCase() === author) {
        booksByAuthor.push({ isbn, ...book })
      }
    }
  }

  if (!booksByAuthor.length) {
    return res.status(404).json({
      status: res.statusCode,
      message: `Books by author ${author} was not found`,
      books: booksByAuthor,
    });
  }

  return res.status(200).json({
    status: res.statusCode,
    message: "GET books successfull",
    books: booksByAuthor,
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title.split("-").join(" ").toLocaleLowerCase()

  let bookWithTitle = undefined

  for (const isbn in books) {
    if (Object.hasOwnProperty.call(books, isbn)) {
      const book = books[isbn];

      if (book.title.toLowerCase() === title) {
        bookWithTitle = { isbn, ...book }
      }
    }
  }

  if (!bookWithTitle) {
    return res.status(404).json({
      status: res.statusCode,
      message: `Books with title "${title}" was not found`,
    });
  }

  return res.status(200).json({
    status: res.statusCode,
    message: "GET book successfull",
    books: bookWithTitle,
  });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const book = books[isbn]

  if (!book) {
    return res.status(404).json({
      status: res.statusCode,
      message: "Book was not found",
    });
  }

  return res.status(200).json({
    status: res.statusCode,
    message: "GET book successfull",
    reviews: book.reviews,
  });
});

module.exports.general = public_users;
