const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

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

persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
    })

app.get('/api/persons/', (request, response) => {
    response.json(persons)
  })



app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info/', (request, response) => {
    const body = `<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`
    response.send(body)
  })

const generateId = () => {
    return String(Math.floor(Math.random() * 1000)) 
}

app.post('/api/persons', (request, response) => {
    const body = request.body
 
    
  if (!body || persons.find(person => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
    persons = persons.concat(person)
    console.log(request.body)
    response.json(persons)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})