const mongoose = require('mongoose')
const Schema = mongoose.Schema

const etudiantSchema = new Schema({
    nom: String,
    prenom: String,
}, {timestamps: true})

const notesSchema = new Schema({
    id_etudiant: String,
    ds: String,
    tp: String,
    examen: String

}, {timestamps: true})

const Etudiant = mongoose.model('etudiant', etudiantSchema)

const Note = mongoose.model('note', notesSchema)

module.exports = { Etudiant, Note }