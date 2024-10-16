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
    xhr.open('GET', 'http://localhost:3000/authors')
    xhr.send();
    xhr.onreadystatechange = function(){
        if (xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.response)
            let tbody = document.querySelector('tbody');
            data.forEach((item,index) => {
                tbody.innerHTML +=
                `<tr>
                <th>${index+1}</th>
                <td>${item.name}</td>
                <td class="text-end">${item.birth.split('T')[0]}</td>
            </tr>`
            });
        }
        
    }

}

function getBooks(){

}