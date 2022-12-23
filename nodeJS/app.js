const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { Etudiant, Note } = require('./models')

const app = express()

const URI = 'mongodb+srv://youneskr:97286305.@cluster0.p8abuu9.mongodb.net/bigdata?retryWrites=true&w=majority'

// Connecter à la BD et mettre notre serveur à l'écoute sur le port 4000
mongoose.set('strictQuery', false)

mongoose.connect(URI)

.then( 
    app.listen(4000, () => {
    // Le message à afficher dans le terminal aprés la connexion
    console.log('BigData 3 IoT 1 --  PORT : ',4000)
    })
)

// Middleware:
// Permettant de traiter facilement
// les données JSON envoyées dans les requêtes POST ou PUT.
app.use(express.json())
app.use(cors())



// ---------------------------------------------------------

// afficherEtudiants
const afficherEtudiants = async (req, res) => {
    const etudiants = await Etudiant.find().sort({nom: 1})
    res.json(etudiants)
}

// Afficher un étudiant particulier 
const afficherUnEtudiant = async (req, res) => {
    // Récuperation des parametres d'URL
    const { nom, prenom } = req.params
    const etudiant = await Etudiant.findOne({nom, prenom})
    res.json(etudiant)
}

// ajouterEtudiant
const ajouterEtudiant = async (req, res) => {
    await Etudiant.create(req.body)
    .then (etudiant => res.json(etudiant))
}

// modifierEtudiant
const modifierEtudiant = async (req, res) => {
    // Récuperation des données envoyées avec la requéte
    const updates = req.body

    // Récuperation des parametres d'URL
    const { nom, prenom } = req.params

    await Etudiant.updateOne({nom, prenom}, {$set :updates })
    .then (result => res.json({updated : "OK"}))
}

// supprimerEtudiant
const supprimerEtudiant = async (req, res) => {
    const { nom, prenom } = req.params

    const etudiant = await Etudiant.findOne({ nom, prenom })

    // S'il n'existe pas la réponse est "Etudiant introuvable"
    if (!etudiant) return res.status(400).json({error: 'Etudiant introuvable'})

    const id = etudiant._id.toString()

    await Etudiant.deleteOne({ nom, prenom })
    .then(etudiant => Note.deleteOne({ id_etudiant: id }))
    .then(result => res.json({deleted: "OK"}))
}


// ---------------------------------------------------------

// Afficher tous les notes des étudiants
const afficherNotes = async (req, res) => {
    const mes = []

    const etudiants = await Etudiant.find().sort({nom: -1})

    const notes = await Note.find()

    // Faire la joiture
    for (let i = 0; i < etudiants.length; i++) {

        for (let j = 0; j < notes.length; j++) {
            if (etudiants[i]._id.toString() == notes[j].id_etudiant) {
                mes.unshift({
                    nom: etudiants[i].nom,
                    prenom: etudiants[i].prenom,
                    ds: notes[j].ds,
                    tp: notes[j].tp,
                    examen: notes[j].examen
                })
            }
        }

        // Si l'étudiant n'a pas encore des notes:
        if (mes.length <= i) {
            mes.unshift({
                nom: etudiants[i].nom,
                prenom: etudiants[i].prenom,
                ds: '',
                tp: '',
                examen: ''
            })
        }
    }

    res.json(mes)
}

// Afficher les notes d'un étudiant spécifique
const notesEtudiant = async (req, res) => {
    const { nom, prenom } = req.params

    const obj = {}
    // vérifier est ce que l'étudiant existe deja ou non
    const etudiant = await Etudiant.findOne({ nom, prenom })

    // S'il n'existe pas la réponse est "Etudiant introuvable"
    if (!etudiant) return res.status(400).json({error: 'Etudiant introuvable'})


    const notes = await Note.findOne({id_etudiant: etudiant._id.toString()})

    if (!notes) {
        obj.ds = ''
        obj.tp = ''
        obj.examen = ''
    }
    else {
        obj.ds = notes.ds
        obj.tp = notes.tp
        obj.examen = notes.examen
    }
    res.json(obj)
}

// Ajouter ou modifier une note pour un étudiant
const gererNote = async (req, res) => {
    const { nom, prenom } = req.params

    // vérifier est ce que l'étudiant existe deja ou non
    const etudiant = await Etudiant.findOne({ nom, prenom })

    // S'il n'existe pas la réponse est "Etudiant introuvable"
    if (!etudiant) return res.status(400).json({error: 'Etudiant introuvable'})

    // vérifier est ce que l'étudiant a deja des notes ou non
    const noteExist = await Note.findOne({ id_etudiant: etudiant._id })

    // S'il n'a pas des notes on crée un document des notes
    if (!noteExist) {
        const obj = {id_etudiant: etudiant._id, ...req.body}
        await Note.create(obj)
        .then( result => res.json(result))
    }

    // S'il a des notes existent deja, on les modifie !
    else {
        await Note.updateOne({id_etudiant: etudiant._id}, {$set: req.body})
        .then( result => res.json({update: "OK"}))
    }
}


// supprimerNote
const supprimerNotes = async (req, res) => {

    const { nom, prenom } = req.params

    const etudiant = await Etudiant.findOne({ nom, prenom })

    // S'il n'existe pas la réponse est "Etudiant introuvable"
    if (!etudiant) return res.status(400).json({error: 'Etudiant introuvable'})


    await Note.deleteOne({id_etudiant: etudiant._id.toString()})
    .then(result => res.json({deleted: "OK"}))

}

// ---------------------------------------------------------

// Routes étudiants
app.get('/api/etudiants', afficherEtudiants)
app.get('/api/etudiants/:nom-:prenom', afficherUnEtudiant)
app.post('/api/etudiants/', ajouterEtudiant)
app.patch('/api/etudiants/:nom-:prenom', modifierEtudiant)
app.delete('/api/etudiants/:nom-:prenom', supprimerEtudiant)

// ---------------------------------------------------------

// Routes notes
app.get('/api/notes', afficherNotes)
app.get('/api/notes/:nom-:prenom', notesEtudiant)
app.post('/api/notes/:nom-:prenom', gererNote)
app.delete('/api/notes/:nom-:prenom', supprimerNotes)