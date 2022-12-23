const urlParams = new URLSearchParams(window.location.search)

const nom = urlParams.get('nom');
const prenom = urlParams.get('prenom');


const getEtudiant = async (nom, prenom) => {
    try {
        const response = await fetch(`http://127.0.0.1:4000/api/etudiants/${nom}-${prenom}`)
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

    fetch(`http://127.0.0.1:4000/api/etudiants/${nom}-${prenom}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        window.location.replace('/index.html')
    })

}




getEtudiant(nom, prenom)
.then(etudiant => {
    document.getElementById('nom').value = etudiant.nom
    document.getElementById('prenom').value = etudiant.prenom
})