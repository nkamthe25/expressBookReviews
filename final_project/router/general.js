```javascript
const express = require('express');
const axios = require('axios');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();

// Task 6: Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: 'Username and password are required'
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: 'Username already exists'
        });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: 'User successfully registered. Now you can login'
    });
});

// Task 1: Get all books
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books-data');
        return res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        // Fallback to the local books database
        return res.send(JSON.stringify(books, null, 4));
    }
});

// Internal route for Axios to retrieve the books database
public_users.get('/books-data', (req, res) => {
    return res.json(books);
});

// Task 2: Get book details by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books-data');
        const allBooks = response.data;
        const isbn = req.params.isbn;

        if (allBooks[isbn]) {
            return res.send(JSON.stringify(allBooks[isbn], null, 4));
        }

        return res.status(404).json({ message: 'Book not found' });
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving books' });
    }
});

// Task 3: Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books-data');
        const allBooks = response.data;
        const author = req.params.author.toLowerCase();
        const result = {};

        Object.keys(allBooks).forEach((key) => {
            if (
                allBooks[key].author &&
                allBooks[key].author.toLowerCase() === author
            ) {
                result[key] = allBooks[key];
            }
        });

        return res.send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving books' });
    }
});

// Task 4: Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books-data');
        const allBooks = response.data;
        const title = req.params.title.toLowerCase();
        const result = {};

        Object.keys(allBooks).forEach((key) => {
            if (
                allBooks[key].title &&
                allBooks[key].title.toLowerCase() === title
            ) {
                result[key] = allBooks[key];
            }
        });

        return res.send(JSON.stringify(result, null, 4));
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving books' });
    }
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
        return res.send(JSON.stringify(books[isbn].reviews || {}, null, 4));
    }

    return res.status(404).json({ message: 'Book not found' });
});

module.exports.general = public_users;
```
