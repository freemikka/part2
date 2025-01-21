const mongoose = require('mongoose')


console.log('person.js')
const uri = process.env.MONGODB_URI
// const uri = `mongodb+srv://mwheeler19972016:$jOWcaDMqBTaU7voV@cluster0.21m7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
console.log(uri)
// mongodb+srv://mwheeler19972016:jOWcaDMqBTaU7voV@cluster0.21m7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongodb+srv://mwheeler19972016:$jOWcaDMqBTaU7voV@cluster0.21m7m.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
mongoose.set('strictQuery',false)

mongoose.connect(uri)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number:     {
    type: String,
    minLength: 3,
    required: true
},
})

const Person = mongoose.model('Person', personSchema)

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})



module.exports = mongoose.model('Person', personSchema)