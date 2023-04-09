const mongoose = require('mongoose')
const axios = require("axios");

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.0wktqwo.mongodb.net/phonebook?retryWrites=true&w=majority`
const baseURL= 'http://localhost:3001/api/persons'
const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Phonebook', phonebookSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    if (process.argv.length === 3) {
        Person.find({}).then(result => {
            result.forEach(person => {
                console.log(person)
            })
            return mongoose.connection.close()
        })
    } else if (process.argv.length === 5){
      const person = new Person({
          name: process.argv[3],            
          number: process.argv[4]
      })
      Person.find({}).then(result => {
        return result.map(person => person.name)
      }).then(result => {
        if(result.includes(person.name)) {
          console.log(`${person.name} is already added to phonebook, replacing the old number with a new one`)

          Person.findOne({ name: person.name }).then(result => {
            updateNumber(result.id, person.number);
          });
        }
        else {
          return person.save().then(() => {
              console.log(`added ${person.name} number ${person.number} to phonebook`)
              return mongoose.connection.close()
          })   
        } 
      })
    }  
  })
  .catch((err) => console.log(err))

  function updateNumber(id, number) {
      Person.findById(id).then(result => {
        const changedPerson = {id:result.id, name:result.name, number: number } 
        return axios.put(`${baseURL}/${id}`, changedPerson)
      })

  }


