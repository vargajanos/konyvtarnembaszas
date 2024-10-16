var xhr = new XMLHttpRequest();

render('author')
async function render(view){
    let main = document.querySelector('main');
    main.innerHTML = await (await fetch(`views/${view}.html`)).text();
    
    switch(view){
        case 'author':{
            getAuthors()
            break;
        }
        case 'book':{
            getBooks()
            break;
        }
    }
}

function getAuthors(){
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = ""
    xhr.open('GET', 'http://localhost:3000/authors')
    xhr.send();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.response)
            data.forEach((item,index) => {
                tbody.innerHTML +=
                `<tr>
                    <th>${index+1}</th>
                    <td>${item.name}</td>
                    <td class="text-center">${item.birth.split('T')[0]}</td>
                    <td class="text-end">
                        <button type="button" class="btn gonb" >Módosítás</button>
                        <button type="button" class="btn gonb" >Törlés</button>
                    </td>
                </tr>`
            });
        }   
    }
}

function addAuthor(){
    var data = JSON.stringify({
        name: document.querySelector("#name").value,
        birth: document.querySelector("#birth").value
    })
    console.log(data)
    xhr.open("POST", 'http://localhost:3000/authors', true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data)

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            alert("Sikeres felvétel")
            getAuthors()
            document.querySelector("#name").value = null
            document.querySelector("#birth").value = null
        }
    }
}

function getBooks() {
    let select = document.querySelector('#select');
    
    //Authors
    const authorsPromise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/authors');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.response);
                    resolve(data);
                } else {
                    reject('Nem jó authors:', xhr.statusText);
                }
            }
        };
        xhr.send();
    });

    //Könyvek
    const booksPromise = new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:3000/books');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const books = JSON.parse(xhr.response);
                    resolve(books);
                } else {
                    reject('Nem jó books:', xhr.statusText);
                }
            }
        };
        xhr.send();
    });

    //Könyvek és az authorok össze kombozása
    Promise.all([authorsPromise, booksPromise])
        .then(results => {
            const authors = results[0];
            const books = results[1];
            
            select.innerHTML ="";
            select.innerHTML+= `<option selected value=""></option>`
            authors.forEach(item => {
                select.innerHTML += `<option value="${item.ID}">${item.name}</option>`;
            });

            CardsandAuthors(books);
        })
        .catch(error => console.error(error));
}

function addBook(){ 
    let szerzoID = JSON.parse(document.querySelector('#select').value); 


    var data = JSON.stringify({
        title: document.querySelector('#cim').value,
        releasedate: document.querySelector('#release').value,
        ISBN: document.querySelector('#isbn').value
    })
    xhr.open("POST", 'http://localhost:3000/books', true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data)

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            getBooks();
            felvettKonyvID(szerzoID);
            document.querySelector("#cim").value = null
            document.querySelector("#release").value = null
            document.querySelector("#isbn").value = null

        }
    }

}
function felvettKonyvID(szerzoID){
    let bookID = ""; 
    xhr.open("GET", "http://localhost:3000/books2", true)
    xhr.send();
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            book = JSON.parse(xhr.response)
            bookID = book[0].ID
            szerzoAkonyvhoz(bookID, szerzoID)

        }
}
}

function szerzoAkonyvhoz(bookID, szerzoID){

    var data = JSON.stringify({
        bookID: bookID,
        szerzoID: szerzoID,
    })
    
    console.log(data)
    xhr.open("POST", 'http://localhost:3000/book_authors', true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data)
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
                alert("Sikeres felvétel")
    }

}


}


function CardsandAuthors(books) {
    const cardContainer = document.querySelector('#cards');
    cardContainer.innerHTML = "";
    const authorPromises = books.map(item => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `http://localhost:3000/book_authors/${item.ID}`);
            xhr.onload = function() {
                if (xhr.status === 200 && xhr.readyState == 4) {
                    const authors = JSON.parse(xhr.response);
                    const authorNames = authors.map(adat => adat.name).join(', ');
                    resolve({ title: item.title, releasedate: item.releasedate, ISBN: item.ISBN, authors: authorNames });
                } else {
                    reject('Nem jó authors:', xhr.statusText);
                }
            };
            xhr.send();
        });
    });

    Promise.all(authorPromises).then(results => {
        results.forEach(book => {
            cardContainer.innerHTML+= `
                <div class="card m-3" style="width: 16rem;">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">${book.authors}</h6>
                        <p class="card-text">Kiadás dátuma: ${book.releasedate.split('T')[0]}</p>
                        <p class="card-text">Könyv ISBN-je: ${book.ISBN}</p>
                        <button type="button" class="btn gonb" >Módosítás</button>
                        <button type="button" class="btn gonb" >Törlés</button>
                    </div>
                </div>`;
            
        });
    }).catch(error => console.error(error));
}

