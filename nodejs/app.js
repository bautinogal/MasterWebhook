const express = require('express');
const mysql = require('mysql');

const app = express();

// Create connection
console.log('Creating connection to db...');
/*
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '73e6f3141c6b',
    database: 'urbetrack'
});

console.log('Connected to db...');

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected...');
});
*/

/*
let sql = 'CREATE DATABASE urbetrack';
db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send('Database created...');
});

let sql = 'CREATE TABLE events(id int AUTO_INCREMENT, title VARCHAR(255), body VARCHAR(255), PRIMARY KEY(id))';
db.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send('Events table created...');
});
*/

// Insert post 1
app.get('/addpost', (req, res) => {
    let post = { title: 'Post One', body: 'This is post number one' };
    let sql = 'INSERT INTO posts SET ?';
    let query = db.query(sql, post, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Post 1 added...');
    });
});

// Select posts
app.get('/getposts', (req, res) => {
    let sql = 'SELECT * FROM posts';
    let query = db.query(sql, (err, results) => {
        if (err) throw err;
        console.log(results);
        res.send('Posts fetched...');
    });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});