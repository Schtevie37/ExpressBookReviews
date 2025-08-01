const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;  
  const authorBooks = [];  
  
  for (const book in books) {  
    if (books[book].author === author) {  
      authorBooks.push(books[book]);
    }
  }
  
  if (authorBooks.length > 0) {  
    res.send(authorBooks);  
  } else {
    res.status(404).send('No books found for author');  
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));
    if(filteredBooks.length > 0){
        return res.status(200).json(filteredBooks);
    }
    else{
        return res.status(404).json({message: "Book not found"});
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    const reviews = books[isbn].reviews;
    return res.status(200).json({ reviews: reviews });
  //return res.status(300).json({message: "Yet to be implemented"});
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Get all books using Async callbacks
public_users.get("/asyncbooks", async function (req,res) {
  try {
    let response = await axios.get("http://localhost:5000/");
    console.log(response.data);
    return res.status(200).json(response.data);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error getting book list"});
  }
});

public_users.get("/asyncisbnsearch/:isbn", async function (req,res) {
  const isbn = req.params.isbn;

  try {
    let response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(response.data);
    return res.status(200).json(response.data);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error getting ISBN"});
  }
});

public_users.get("/asyncauthorsearch/:author", async function (req,res) {
  const author = req.params.author;

  try {
    let response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
    return res.status(200).json(response.data);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error getting author"});
  }
});

public_users.get("/asynctitlesearch/:title", async function (req,res) {
  const title = req.params.title;

  try {
    let response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(response.data);
    return res.status(200).json(response.data);
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: "Error getting title"});
  }
});

module.exports.general = public_users;
