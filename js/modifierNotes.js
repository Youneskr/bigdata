const urlParams = new URLSearchParams(window.location.search)

const nom = urlParams.get('nom');
const prenom = urlParams.get('prenom');


const getNote = async (nom, prenom) => {
    try {
        const response = await fetch(`http://127.0.0.1:4000/api/notes/${nom}-${prenom}`)
        const data = await response.json()
        return data;
    } catch (error) {
        console.error(error);
    }
}


const submitForm = (event) => {

    event.preventDefault()

    
    const form = document.getElementById('form')

    const elements = form.elements

    const data = {}
    for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.name) {
        data[element.name] = element.value;
    }
}

    fetch(`http://127.0.0.1:4000/api/notes/${nom}-${prenom}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        window.location.replace('/etudiants.html')
    })

}




getNote(nom, prenom)
.then(notes => {
    document.getElementById('ds').value = notes.ds
    document.getElementById('tp').value = notes.tp
    document.getElementById('examen').value = notes.examen
})