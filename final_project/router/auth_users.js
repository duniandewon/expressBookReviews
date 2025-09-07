const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return !users.filter(usr => usr.username === username).length
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users.find(usr => usr.username === username)

  if (!user) return false

  return user.password === password
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body

  const isAuthenticated = authenticatedUser(username, password)

  if (!isAuthenticated) {
    return res.status(400).json({
      status: res.statusCode,
      message: "wrong username or password"
    })
  }

  const accessToken = jwt.sign(
    {
      data: password
    },
    'access',
    { expiresIn: 60 * 60 });

  req.session.authorization = {
    accessToken, username
  }

  return res.status(200).json({
    status: res.statusCode,
    message: "User successfully logged in"
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn
  const review = req.body.review

  const book = books[isbn]
  const username = req.session.authorization.username

  if (!book) {
    return res.status(404).json({
      status: res.statusCode,
      message: "Book was not found",
    });
  }

  if (!review) {
    return res.status(404).json({
      status: res.statusCode,
      message: "Review should not be empty",
    });
  }

  book.reviews[username] = review

  return res.status(300).json({
    status: res.statusCode,
    message: "Review added successfully",
    reviews: book.reviews
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn
  const username = req.session.authorization.username

  const book = books[isbn]


  if (!book) {
    return res.status(404).json({
      status: res.statusCode,
      message: "Book was not found",
    });
  }

  const reviewByUsername = book.reviews[username]

  if (!reviewByUsername) {
    return res.status(404).json({
      status: res.statusCode,
      message: "Review not found"
    })
  }

  delete books[isbn].reviews[username]

  return res.status(200).json({
    status: res.statusCode,
    message: "Review delted successfully"
  })
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
