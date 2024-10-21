var xhr = new XMLHttpRequest();

var authors
var loadedAuthor
var books
var loadedBook
var loadedValami

var valami

function getFiam() {
    let konyvSelect = document.querySelector('#konyvSelect');
    let szerzoSelect = document.querySelector('#szerzoSelect');
    
    // Authors lekérése 
    xhr.open('GET', 'http://localhost:3000/authors', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
             authors = JSON.parse(xhr.response);
            
            // Könyvek lekérése 
            xhr.open('GET', 'http://localhost:3000/books', true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    books = JSON.parse(xhr.response);
                    
                   konyvSelect.innerHTML = "";
                   konyvSelect.innerHTML += `<option selected value=""></option>`;                    
                   szerzoSelect.innerHTML = "";
                   szerzoSelect.innerHTML += `<option selected value=""></option>`;
                    
                    authors.forEach(item => {
                        szerzoSelect.innerHTML += `<option value="${item.ID}">${item.name}</option>`;
                    });
                    books.forEach(item => {
                        konyvSelect.innerHTML += `<option value="${item.ID}">${item.title}</option>`;
                    });

                    
                }
            };
            xhr.send();
        }
    };
    xhr.send();
}


function getTable(){
    
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = ""

    
    xhr.open('GET', 'http://localhost:3000/book_authors', true);
    xhr.send();
    xhr.onreadystatechange = function() {
        
        if (xhr.readyState == 4 && xhr.status == 200) {
            valami = JSON.parse(xhr.response)
           
            valami.forEach((item,index) => {
                
                tbody.innerHTML +=
                `<tr>
                    <th>${index+1}</th>
                    <td>${item.title}</td>
                    <td class="text-center">${item.name}</td>
                    <td class="text-end">
                        <button type="button" class="btn gonb mb-1" onclick="loadEditValami(${item.ID})">Módosítás</button>
                        <button type="button" class="btn gonb mb-1" onclick="deleteEditValami(${item.ID})">Törlés</button>
                    </td>
                </tr>`
            });
            getFiam();
        }   
    }

    
}
function addValami(){
    var data = JSON.stringify({
        bookID: document.querySelector("#konyvSelect").value,
        authorID: document.querySelector("#szerzoSelect").value
    })
    

    xhr.open("POST", 'http://localhost:3000/book_authors', true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data)

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            alert("Sikeres felvétel")
            getTable();
            konyvSelect.innerHTML = "";  
            szerzoSelect.innerHTML = "";  
            return
        }
        if(xhr.readyState == 4 && xhr.status != 200){
            alert(xhr.response)
            return
        }
    }

}

function editValami(){
    var data = JSON.stringify({
        bookID: document.querySelector("#konyvSelect").value,
        authorID: document.querySelector("#szerzoSelect").value
    })
    
    xhr.open("PATCH", `http://localhost:3000/book_authors/${loadedValami}`, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data)

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            alert("Sikeres módosítás")
            getTable();
            konyvSelect.innerHTML = "";  
            szerzoSelect.innerHTML = "";  
            document.querySelector("#addValami").classList.remove("d-none")
            document.querySelector("#editValami").classList.add("d-none")
            return
        }
        if(xhr.readyState == 4 && xhr.status != 200){
            alert(xhr.response)
            return
        }
    }


}

function deleteEditValami(id){

    if (confirm("Biztos törlöd?")) {
        
        xhr.open("DELETE", `http://localhost:3000/book_authors/${id}`, true)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send()
    
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                alert("Sikeres törlés")
                getTable();
                return
            }
            if(xhr.readyState == 4 && xhr.status != 200){
                alert(xhr.response)
                return
            }
        }
    }
}

function loadEditValami(id){
    let selectedItem = valami.find((item) => item.ID == id);
    
    // A megfelelő szerző és könyv megkeresése az authors és books listából
    let author = authors.find((item) => item.name === selectedItem.name);
    let book = books.find((item) => item.title === selectedItem.title);

    
    if (loadedValami === selectedItem.ID) {
        loadedValami = null;
        loadedBook = null;
        konyvSelect.innerHTML = "";  
        szerzoSelect.innerHTML = "";  

        document.querySelector("#addValami").classList.remove("d-none");
        document.querySelector("#editValami").classList.add("d-none");

        getFiam();
    } else {
        loadedValami = selectedItem.ID
  
        // Select boxok beállítása az aktuális értékekre
        document.querySelector('#konyvSelect').value = book.ID;  
        document.querySelector('#szerzoSelect').value = author.ID;  

        document.querySelector("#addValami").classList.add("d-none");
        document.querySelector("#editValami").classList.remove("d-none");
    }
}



