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
app.get('/books', (req,res)=>{
    pool.query(`SELECT * FROM books`, (err, results)=>{
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!')
            return;
        }
        res.status(200).send(results);
        return;
    })
})

//utolsó könyv
app.get('/books2', (req,res)=>{
    pool.query(`SELECT * FROM books ORDER BY ID DESC LIMIT 1`, (err, results)=>{
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!')
            return;
        }
        res.status(200).send(results);
        return;
    })
})

//könyv felvétel
app.post('/books', (req, res)=>{
    if (!req.body.title || !req.body.releasedate || !req.body.ISBN) {
        res.status(203).send("Hiányzó adatok");
        return;
    }
    pool.query(`INSERT INTO books (title, releasedate, ISBN) VALUES('${req.body.title}', '${req.body.releasedate}', '${req.body.ISBN}')`, (err, results)=>{
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!');
            return;
        }
        res.status(200).send("Könyv rögzítve");
    })

})

//könyv update
app.patch('/books/:id', (req, res)=>{

    let id = req.params.id;

    if (!id) {
        res.status(203).send("Rossz azonosító");
        return;
    }

    if (!req.body.title || !req.body.releasedate || !req.body.ISBN) {
        res.status(203).send("Hiányzó adatok");
        return;
    }

    pool.query(`UPDATE books SET title='${req.body.title}', releasedate='${req.body.releasedate}', ISBN='${req.body.ISBN}' WHERE ID='${id}'`, (err, results)=>{
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!');
            return;
        }

        res.status(200).send("Sikeres módosítás");
    })
})
//könyv törlés
app.delete('/books/:id', (req,res)=>{
    let id = req.params.id;

    if (!id) {
        res.status(203).send("Rossz azonosító");
        return;
    }

    pool.query(`DELETE from books WHERE ID='${id}'`, (err, results)=>{
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!');
            return;
        }

        if (results.affectedRows == 0){
            res.status(203).send('Nincs ilyen adat!');
            return;
          }

          res.status(200).send('Sikeres könyv törlés');
          return;
    })

})




//szerzők lekérése
app.get('/authors', (req,res)=>{
    pool.query(`SELECT * FROM authors`, (err, results)=>{
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!')
            return;
        }
        res.status(200).send(results);
        return;
    })
})
//szerző felvétel
app.post('/authors', (req, res)=>{
    if (!req.body.name || !req.body.birth) {
        res.status(203).send("Hiányzó adatok");
        return;
    }
    pool.query(`INSERT INTO authors (name, birth) VALUES('${req.body.name}', '${req.body.birth}')`, (err, results)=>{
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!');
            return;
        }
        res.status(200).send("Szerző rögzítve");
    })

})
//szerző módosítása
app.patch('/authors/:id', (req, res)=>{

    let id = req.params.id;

    if (!id) {
        res.status(203).send("Rossz azonosító");
        return;
    }

    if (!req.body.name || !req.body.birth) {
        res.status(203).send("Hiányzó adatok");
        return;
    }

    pool.query(`UPDATE authors SET name='${req.body.name}', birth='${req.body.birth}' WHERE ID='${id}'`, (err, results)=>{
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!');
            return;
        }

        res.status(200).send("Sikeres módosítás");
    })
})
//szerző törlése
app.delete('/authors/:id', (req,res)=>{
    let id = req.params.id;

    if (!id) {
        res.status(203).send("Rossz azonosító");
        return;
    }

    pool.query(`DELETE from authors WHERE ID='${id}'`, (err, results)=>{
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!');
            return;
        }

        if (results.affectedRows == 0){
            res.status(203).send('Nincs ilyen adat!');
            return;
          }

          res.status(200).send('Sikeres szerző törlés');
          return;
    })

})

//könyvnek a szerzői
app.get('/book_authors/:id',(req, res)=>{

    let id = req.params.id;

    if (!id) {
        res.status(203).send("Rossz azonosító");
        return;
    }

    pool.query(`SELECT * FROM authors WHERE ID in (SELECT authorID FROM book_authors WHERE bookID=${id})`,(err,results)=>{

            if (err) {
                res.status(500).send('Hiba történt az adatbázis lekérés közben!');
                return;
            }
            res.status(200).send(results);
    
        
    })

})

//kapcsolo tablaba adas
app.post('/book_authors', (req, res)=>{

    if (!req.body.bookID || !req.body.authorID) {
        res.status(203).send("Hiányzó adatok");
        return;
    }

    pool.query(`INSERT INTO book_authors (bookID, authorID) VALUES('${req.body.bookID}', '${req.body.authorID}')`, (err, results)=>{
        if (err) {
            res.status(500).send('Hiba történt az adatbázis lekérés közben!');
            return;
        }
        res.status(200).send("Szerző könyvhöz rendelve");
    })

})



app.listen(port, () => {
  
    console.log(`A masinéria megfigyel itten e: ${port}...`);
  });
  
