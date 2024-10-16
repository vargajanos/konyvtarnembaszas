require('dotenv').config();
const express = require('express');
var cors = require('cors');
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

var mysql = require('mysql');

var pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
  });

//összes könyv
app.get('/books')




app.listen(port, () => {
  
    console.log(`A masinéria megfigyel itten e: ${port}...`);
  });
  
