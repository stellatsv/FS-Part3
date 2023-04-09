require('dotenv').config()
const express = require('express')
const app = express()

const Person = require('./models/person')

app.use(require('cors')());
var morgan = require('morgan')
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', req => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :body'))




app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

app.get('/info', (request, response) => {
    const time = Date().toLocaleString()
    Person.countDocuments({age:{$gte:5}}, function (err, count) {
      if (err){
          console.log(err)
      }else{
        response.send(`<p>Phonebook has info for ${count} people. </p>
        <p>${time}</p>`)
      }
  });            
})
  
app.get('/api/persons/:id', (request, response) => {
    const person = Person.findById(request.params.id).then(p => {
      if (p) {    
        response.json(p)  
      } 
      else {    
        response.status(404).end()  
      }
    }).catch(error => {     
      console.log(error)      
      response.status(400).send({ error: 'malformatted id' })  
    })
    
})
 


app.delete('/api/persons/:id', (request, response) => {
    const person =  Person.findByIdAndRemove(request.params.id).then(result => {
      if (result) {    
        response.json(result)  
      } 
      else {    
        response.status(404).end()  
      }
    }).catch(error => {     
      console.log(error)      
      response.status(400).send({ error: 'malformatted id' })  
    })
})


app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'details missing' 
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler)


app.listen(process.env.PORT || 3001, '0.0.0.0', () => {
  console.log("Server is running.");
});