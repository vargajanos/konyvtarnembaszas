var xhr = new XMLHttpRequest();

var authors
var loadedAuthor


function getAuthors(){
    let tbody = document.querySelector('tbody');
    tbody.innerHTML = ""
    xhr.open('GET', 'http://localhost:3000/authors')
    xhr.send();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
            authors = JSON.parse(xhr.response)
            authors.forEach((item,index) => {
                tbody.innerHTML +=
                `<tr>
                    <th>${index+1}</th>
                    <td>${item.name}</td>
                    <td class="text-center">${item.birth.split('T')[0]}</td>
                    <td class="text-end">
                        <button type="button" class="btn gonb mb-1" onclick="loadEdit(${item.ID})">Módosítás</button>
                        <button type="button" class="btn gonb mb-1" onclick="deleteAuthor(${item.ID})">Törlés</button>
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

function loadEdit(id){
    let author = authors.find((item) => item.ID == id)

    if(loadedAuthor == author){
        loadedAuthor = null
        document.querySelector("#name").value = null
        document.querySelector("#birth").value = null

        document.querySelector("#addAuthor").classList.remove("d-none")
        document.querySelector("#editAuthor").classList.add("d-none")
    }
    else{
        loadedAuthor = author
        document.querySelector("#name").value = author.name
        document.querySelector("#birth").value = author.birth.split('T')[0]

        document.querySelector("#addAuthor").classList.add("d-none")
        document.querySelector("#editAuthor").classList.remove("d-none")
    }
}



function editAuthor(){
    var data = JSON.stringify({
        name: document.querySelector("#name").value,
        birth: document.querySelector("#birth").value
    })
    
    xhr.open("PATCH", `http://localhost:3000/authors/${loadedAuthor.ID}`, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(data)

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            alert("Sikeres módosítás")
            getAuthors()
            document.querySelector("#name").value = null
            document.querySelector("#birth").value = null
            document.querySelector("#addAuthor").classList.remove("d-none")
            document.querySelector("#editAuthor").classList.add("d-none")
            return
        }
        if(xhr.readyState == 4 && xhr.status != 200){
            alert(xhr.response)
            return
        }
    }
}

function deleteAuthor(id){
    if (confirm("Biztos törlöd?")) {
        
        xhr.open("DELETE", `http://localhost:3000/authors/${id}`, true)
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send()
    
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4 && xhr.status == 200){
                alert("Sikeres törlés")
                getAuthors()
                return
            }
            if(xhr.readyState == 4 && xhr.status != 200){
                alert(xhr.response)
                return
            }
        }
    }
}