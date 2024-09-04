const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ""
});


app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).send({ error: 'person not found' })
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'data missing'
    })
  }

  const personFound = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())
  if (personFound) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const id = Math.floor(Math.random() * 1000000000)
  const person = {
    id: id,
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  res.json(person)
})

app.get('/info', (req, res) => {
  const numberOfPersons = persons.length
  const date = new Date()
  const info = `<p>Phonebook has info for ${numberOfPersons} people</p> <p>${date}</p>`
  
  res.send(info)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
