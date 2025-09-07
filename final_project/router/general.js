const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body

  if (!username) {
    return res.status(400).json({
      status: res.statusCode,
      message: "Please provide a username"
    })
  }

  if (!password) {
    return res.status(400).json({
      status: res.statusCode,
      message: "Please provide a password"
    })
  }

  if (isValid(username)) {
    users.push({ username, password })

    return res.status(200).json({
      status: res.statusCode,
      message: "Registered successfully"
    });
  }

  return res.status(400).json({
    status: res.statusCode,
    message: "username not available"
  })
});

const getBooks = () => {
  return new Promise((resolve, reject) => {
    try {
      resolve(books);
    } catch (error) {
      reject(error);
    }
  });
};

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  getBooks()
    .then((booksData) => {
      res.status(200).json({
        status: res.statusCode,
        message: "GET books successfull",
        books: booksData,
      });
    })
    .catch((error) => {
      res.status(500).json({
        status: 500,
        message: "Internal Server Error",
        error: error.message
      });
    });
});

const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    try {
      const book = books[isbn];
      if (!book) {
        reject(new Error("Book was not found"));
      } else {
        resolve(book);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  getBookByISBN(isbn)
    .then((book) => {
      res.status(200).json({
        status: res.statusCode,
        message: "GET book successfull",
        book: book,
      });
    })
    .catch((error) => {
      if (error.message === "Book was not found") {
        res.status(404).json({
          status: 404,
          message: "Book was not found",
        });
      } else {
        res.status(500).json({
          status: 500,
          message: "Internal Server Error",
          error: error.message
        });
      }
    });
});

const getBooksByAuthor = (authorName) => {
  return new Promise((resolve, reject) => {
    try {
      const author = authorName.split("-").join(" ").toLowerCase();
      let booksByAuthor = [];

      for (const isbn in books) {
        if (Object.hasOwnProperty.call(books, isbn)) {
          const book = books[isbn];

          if (book.author.toLowerCase() === author) {
            booksByAuthor.push({ isbn, ...book });
          }
        }
      }

      if (!booksByAuthor.length) {
        reject(new Error(`Books by author ${author} was not found`));
      } else {
        resolve(booksByAuthor);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const authorParam = req.params.author;

  getBooksByAuthor(authorParam)
    .then((booksByAuthor) => {
      res.status(200).json({
        status: res.statusCode,
        message: "GET books successfull",
        books: booksByAuthor,
      });
    })
    .catch((error) => {
      if (error.message.includes("was not found")) {
        res.status(404).json({
          status: 404,
          message: error.message,
          books: [],
        });
      } else {
        res.status(500).json({
          status: 500,
          message: "Internal Server Error",
          error: error.message
        });
      }
    });
});

const getBookByTitle = (titleParam) => {
  return new Promise((resolve, reject) => {
    try {
      const title = titleParam.split("-").join(" ").toLowerCase();
      let bookWithTitle = undefined;

      for (const isbn in books) {
        if (Object.hasOwnProperty.call(books, isbn)) {
          const book = books[isbn];

          if (book.title.toLowerCase() === title) {
            bookWithTitle = { isbn, ...book };
            break; // Found the book, exit loop
          }
        }
      }

      if (!bookWithTitle) {
        reject(new Error(`Books with title "${title}" was not found`));
      } else {
        resolve(bookWithTitle);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const titleParam = req.params.title;

  getBookByTitle(titleParam)
    .then((bookWithTitle) => {
      res.status(200).json({
        status: res.statusCode,
        message: "GET book successfull",
        books: bookWithTitle,
      });
    })
    .catch((error) => {
      if (error.message.includes("was not found")) {
        res.status(404).json({
          status: 404,
          message: error.message,
        });
      } else {
        res.status(500).json({
          status: 500,
          message: "Internal Server Error",
          error: error.message
        });
      }
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
