var xhr = new XMLHttpRequest();

var books;
var loadedBook;

// Könyv lekérése
function getBooks() {
    let select = document.querySelector('#select');
    
    // Authors lekérése 
    xhr.open('GET', 'http://localhost:3000/authors', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const authors = JSON.parse(xhr.response);
            
            // Könyvek lekérése 
            xhr.open('GET', 'http://localhost:3000/books', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    books = JSON.parse(xhr.response);
                    
                    select.innerHTML = "";
                    select.innerHTML += `<option selected value=""></option>`;
                    
                    authors.forEach(item => {
                        select.innerHTML += `<option value="${item.ID}">${item.name}</option>`;
                    });
                    
                    CardsandAuthors(books);
                }
            };
            xhr.send();
        }
    };
    xhr.send();
}

// Könyv felvétel
function addBook() { 
    let szerzoID = JSON.parse(document.querySelector('#select').value); 

    var data = JSON.stringify({
        title: document.querySelector('#cim').value,
        releasedate: document.querySelector('#release').value,
        ISBN: document.querySelector('#isbn').value
    });
    
    xhr.open("POST", 'http://localhost:3000/books', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            getBooks();
            felvettKonyvID(szerzoID);
            document.querySelector("#cim").value = null;
            document.querySelector("#release").value = null;
            document.querySelector("#isbn").value = null;
        }
    };
}

// A felvett könyv ID visszakérése
function felvettKonyvID(szerzoID) {
    let bookID = ""; 
    xhr.open("GET", "http://localhost:3000/books2", true);
    xhr.send();
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            book = JSON.parse(xhr.response);
            bookID = book[0].ID;
            szerzoAkonyvhoz(bookID, szerzoID);
        }
    };
}

// Kapcsolótábla feltöltése
function szerzoAkonyvhoz(bookID, szerzoID) {
    var data = JSON.stringify({
        bookID: bookID,
        authorID: szerzoID,
    });
    
    xhr.open("POST", 'http://localhost:3000/book_authors', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            alert("Sikeres felvétel");
            getBooks();
        }
    };
}

// Könyvek betöltése az oldalra
function CardsandAuthors(books) {
    const cardContainer = document.querySelector('#cards');
    cardContainer.innerHTML = "";

    // Könyvek és szerzők összekapcsolása
    books.forEach(function(item) {
        let xhr = new XMLHttpRequest(); 
        xhr.open('GET', `http://localhost:3000/book_authors/${item.ID}`, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const authors = JSON.parse(xhr.response);
                const authorNames = authors.map(adat => adat.name).join(', ');

                // Minden könyvhez új kártya létrehozása
                cardContainer.innerHTML += `
                    <div class="card m-3" style="width: 16rem;">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">Szerzők: ${authorNames}</h6>
                            <p class="card-text">Kiadás dátuma: ${item.releasedate.split('T')[0]}</p>
                            <p class="card-text">Könyv ISBN-je: ${item.ISBN}</p>
                            <button type="button" class="btn gonb" onclick="loadEditBook(${item.ID})">Módosítás</button>
                            <button type="button" class="btn gonb" onclick="deleteBook(${item.ID})">Törlés</button>
                        </div>
                    </div>`;
            }
        };
        xhr.send();
    });
}



//edit betöltése
function loadEditBook(id){
    let book = books.find((item) => item.ID == id)


    if(loadedBook == book){
        loadedBook = null
        document.querySelector("#cim").value = null
        document.querySelector("#release").value = null
        document.querySelector("#isbn").value = null

        document.querySelector("#addBook").classList.remove("d-none")
        document.querySelector("#editBook").classList.add("d-none")
    }
    else{
        loadedBook = book
        document.querySelector("#cim").value = book.title
        document.querySelector("#release").value = book.releasedate.split('T')[0]
        document.querySelector("#isbn").value = book.ISBN

        document.querySelector("#addBook").classList.add("d-none")
        document.querySelector("#editBook").classList.remove("d-none")
    }
}
//edit végrehajtása
function editBook(){
    var data = JSON.stringify({
        title: document.querySelector("#cim").value,
        releasedate: document.querySelector("#release").value,
        ISBN: document.querySelector("#isbn").value
    })
    
    xhr.open("PATCH", `http://localhost:3000/books/${loadedBook.ID}`, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data)

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            alert("Sikeres módosítás")
            getBooks()
            document.querySelector("#cim").value = null
            document.querySelector("#release").value = null
            document.querySelector("#isbn").value = null
            document.querySelector("#addBook").classList.remove("d-none")
            document.querySelector("#editBook").classList.add("d-none")
            return
        }
        if(xhr.readyState == 4 && xhr.status != 200){
            alert(xhr.response)
            return
        }
    }
}

function deleteBook(id){
    if (confirm("Biztos törlöd?")) {
        
        xhr.open("DELETE", `http://localhost:3000/books/${id}`, true)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send()
    
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                alert("Sikeres törlés")
                getBooks()
                return
            }
            if(xhr.readyState == 4 && xhr.status != 200){
                alert(xhr.response)
                return
            }
        }
    }
}