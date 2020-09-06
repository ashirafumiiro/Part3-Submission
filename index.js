const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const { response, request } = require('express');
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static('build'))
require('dotenv').config()
const Person = require('./models/person')


morgan.token('body', function (req, res) { 
    if (req.method === "POST")
        return JSON.stringify(req.body) 
    return ""
    })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/api/persons', (request, response, next)=>{
    Person.find({}).then(people=>{
        response.json(people);
    })
    .catch(error=>next(error))
})

app.get('/info', (request, response, next)=>{
    Person.find({}).then(people=>{
        response.write(`<p>Phonebook has info for ${people.length} people</p>`);
        response.end(`<p>${new Date().toString()}</p>`)
    })
    .catch(error=>next(error))
    
})

app.get('/api/persons/:id', (request, response, next)=>{
    const id = request.params.id;
    
    Person.findById(id).then(person=>{
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error=>next(error))
})

app.delete('/api/persons/:id', (request, response, next)=>{
    const id = request.params.id;
    Person.findByIdAndRemove(id)
        .then(result=> response.status(204).end())
        .catch(error=>next(error))
})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
}

app.post('/api/persons', (request, response, next)=>{
    const body = request.body;
    
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson=>{
        response.json(savedPerson);
    })
    .catch(error=>next(error));
})

app.put('/api/persons/:id', (request, response, next)=>{
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true, runValidators: true, context: 'query'})
        .then(updatedPerson=>{
            response.json(updatedPerson)
        })
        .catch(error=> next(error))
})

const errorHandler = (error, request, response, next)=>{
    console.log(error.message);
    if (error.name==="CastError") {
        return response.status(400).send({error: "Mulformated id"});
    }
    else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, 
    () => {
    console.log(`Server running on port ${PORT}`)}
)