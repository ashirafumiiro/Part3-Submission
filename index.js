const express = require('express');
const morgan = require('morgan')
const cors = require('cors')
const { response, request } = require('express');
const app = express();
app.use(express.json())
app.use(cors())

morgan.token('body', function (req, res) { 
    if (req.method === "POST")
        return JSON.stringify(req.body) 
    return ""
    })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]


app.get('/api/persons', (request, response)=>{
    response.json(persons);
})

app.get('/info', (request, response)=>{

    response.write(`<p>Phonebook has info for ${persons.length} people</p>`);
    response.end(`<p>${new Date().toString()}</p>`)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id);
    const person = persons.find(person=> person.id === id)
    if (!person) {
        response.status(404).end()
    }
    else{
        response.json(person)
    }
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id);
    const person = persons.find(p=>p.id === id);

    if (!person) {
        response.status(404).end();
    }
    else{
        persons = persons.filter(p=>p.id !== id)
        response.status(204).end();
    }

})

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
}

app.post('/api/persons', (request, response)=>{
    const body = request.body;
    
    if (!body.number || !body.name) {
        return response.status(400).json({error: "Both name and number are required"})
    }
    else if (persons.find(p => p.name === body.name) !== undefined){
        return response.status(400).json({ error: "name must be unique"})
    }
    const person = {
        name: body.name,
        number: body.number,
        id: getRandomInt(1,500)
    }

    persons = persons.concat(person);
    response.json(person)
})

const PORT = 3001

app.listen(PORT)
console.log(`Server listening at port: ${PORT}`);