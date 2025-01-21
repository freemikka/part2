const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const db_password = process.argv[2]

const uri = 
    `mongodb+srv://mwheeler19972016:${db_password}@cluster0.21m7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery',false)

mongoose.connect(uri)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3]) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to the phonebook!`)
    mongoose.connection.close()
  })
} else {
  Person
    .find({})
    .then(persons => {
      console.log(`Phonebook: \n${persons.map(person => `${person.name} ${person.number}`).join('\n')}`)
      mongoose.connection.close()
    })
}

