const express = require('express')
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

app.use(express.static('build'))
app.use(require('cors')());
var morgan = require('morgan')
app.use(express.json())
morgan.token('body', req => {
    return JSON.stringify(req.body)
  })
app.use(morgan(':method :url :body'))

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
    const time = Date().toLocaleString()
    const length = persons.length
    response.send(`<p>Phonebook has info for ${length} people. </p>
        <p>${time}</p>`)
})
  
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)    
    if (person) {    response.json(person)  } 
    else {    response.status(404).end()  }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)  
    response.status(204).end()
})

const generateId = () => {
   return Math.floor(Math.random() * 100)
}
  
const isFound = (name) => persons.some(person => {
    if (person.name === name) {
      return true;
    }

    return false;
});

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'details missing' 
        })
    }

    if (isFound(body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
  console.log("Server is running.");
});