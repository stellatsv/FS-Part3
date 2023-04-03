const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.0wktqwo.mongodb.net/phonebook?retryWrites=true&w=majority`

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
        return person.save().then(() => {
            console.log(`added ${person.name} number ${person.number} to phonebook`)
            return mongoose.connection.close()
        })        
    }  
  })
  .catch((err) => console.log(err))