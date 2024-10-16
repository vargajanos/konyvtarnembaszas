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
    
    xhr.open("POST", 'http://localhost:3000/authors', true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data)

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            alert("Sikeres felvétel")
            getAuthors()
            document.querySelector("#name").value = null
            document.querySelector("#birth").value = null
            return
        }
        if(xhr.readyState == 4 && xhr.status != 200){
            alert(xhr.response)
            return
        }
    }
}

function getBooks() {
    
    xhr.open('GET', 'http://localhost:3000/books');
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const books = JSON.parse(xhr.response);
            CardsandAuthors(books);
        } 

    };
    
}

function CardsandAuthors(books) {
    const cardContainer = document.querySelector('#cards');
    const authorPromises = books.map(item => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', `http://localhost:3000/book_authors/${item.ID}`);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    const authors = JSON.parse(xhr.response);
                    const authorNames = authors.map(adat => adat.name).join(', ');
                    resolve({ title: item.title, releasedate: item.releasedate, ISBN: item.ISBN, authors: authorNames });
                } else {
                    reject('Error fetching authors:', xhr.statusText);
                }
            };
            xhr.send();
        });
    });

    Promise.all(authorPromises).then(results => {
        results.forEach(book => {
            const cardHTML = `
                <div class="card mb-3" style="width: 18rem;">
                    <div class="card-body">
                        <h5 class="card-title">${book.title}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">Szerzők: ${book.authors}</h6>
                        <p class="card-text">Kiadás dátuma: ${book.releasedate.split('T')[0]}</p>
                        <p class="card-text">Könyv ISBN-je: ${book.ISBN}</p>
                    </div>
                </div>`;
            cardContainer.innerHTML += cardHTML;
        });
    }).catch(error => console.error(error));
}

