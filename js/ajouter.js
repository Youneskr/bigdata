const submitForm = (event) => {

    event.preventDefault()

    document.getElementById('error').innerText = ''
    
    const form = document.getElementById('form')

    const elements = form.elements

    const data = {}
    for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element.name) {
        data[element.name] = element.value;
    }
}

    if (data.name == '' || data.prenom == '') {
        document.getElementById('error').innerText = 'Remplir tous les champs !'
    }
    
    else {

        fetch('http://127.0.0.1:4000/api/etudiants/', {
            method: 'POST',
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
    

}
