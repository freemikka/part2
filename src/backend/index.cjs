const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person.cjs')
const app = express()

app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    let originalWrite = res.write;
    let originalEnd = res.end;
    let chunks = [];
  
    res.write = function (chunk, ...args) {
      chunks.push(Buffer.from(chunk));
      originalWrite.apply(res, [chunk, ...args]);
    };
  
    res.end = function (chunk, ...args) {
      if (chunk) {
        chunks.push(Buffer.from(chunk));
      }
      res.locals.body = Buffer.concat(chunks).toString('utf8'); // Capture response body
      originalEnd.apply(res, [chunk, ...args]);
    };
  
    next();
  });

morgan.token('res-body', (req, res) => {
    try {
      return JSON.stringify(JSON.parse(res.locals.body), null, 2); // Prettify JSON
    } catch (error) {
      return res.locals.body; // Return raw body if not JSON
    }
  });
  

app.use(morgan(function (tokens, req, res) {
    console.log(tokens['res-body'](req, res))
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      '\nResponse Body:\n',
      tokens['res-body'](req, res)
    ].join(' ')
  }))

// persons = [
//     { 
//       "id": "1",
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": "2",
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": "3",
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": "4",
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
    })

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
  })

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(err => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true, context: 'query'})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(err => next(err))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(err => next(err))
  }) 

app.get('/info/', (request, response) => {
    Person.find({}).then(persons => {
      const body = `<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`
      response.send(body)
    })
    .catch(err => next(err))
    
  })

const generateId = () => {
    return String(Math.floor(Math.random() * 1000)) 
}

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body === undefined) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(err => next(err))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})