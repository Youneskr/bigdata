function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

const getNotes = async () => {
    try {
        const response = await fetch('http://127.0.0.1:4000/api/notes/')
        const data = await response.json()
        return data;
    } catch (error) {
        console.error(error);
    }
}


function afficherTableau(data) {
    const table = document.getElementById('table');

    let html = `
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Nom</th>
                <th scope="col">Prenom</th>
                <th scope="col">DS</th>
                <th scope="col">TP</th>
                <th scope="col">Examen</th>
                <th scope="col"></th>
                <th scope="col"></th>
            </tr>
        </thead>
        <tbody>
    `
    let count = 1
    for (const item of data) {
        html += `
            <tr>
                <th>${count}</th>
                <td>${toTitleCase(item.nom)}</td>
                <td>${toTitleCase(item.prenom)}</td>
                <td>${toTitleCase(item.ds)}</td>
                <td>${toTitleCase(item.tp)}</td>
                <td>${toTitleCase(item.examen)}</td>
                <td>
                    <form method='GET' action='/modifier-notes.html'>
                        <input type="hidden" name="nom" value=${item.nom}>
                        <input type="hidden" name="prenom" value=${item.prenom}>
                        <button class = 'btn'><i class="fa-solid text-success fa-pen"></i></button>
                    </form>
                </td>
                <td>
                    <form method='GET' action='/supp-notes.html'>
                        <input type="hidden" name="nom" value=${item.nom}>
                        <input type="hidden" name="prenom" value=${item.prenom}>
                        <button class = 'btn'><i class="fa-solid text-danger fa-trash"></i></button>
                </form>
                </td>
            </tr>
        `
        count ++
    }

    html +=  '</tbody>'

    table.innerHTML = html
}

getNotes()
.then(data => {
    if (data.length > 0) {
        afficherTableau(data)
    }
    else {
        
    }
})