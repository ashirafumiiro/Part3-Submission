const mongoose = require('mongoose');

let showPersons = true;
const args = process.argv;
if (args.length === 5) {
    showPersons = false;
}
else if (args.length !== 3){
    console.log("Invalid Arguments")
    process.exit(1);
}

const password = args[2];

const url =
    `mongodb+srv://fullstack:${password}@cluster0.gezd5.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema);

if (showPersons) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
else{
    const name = args[3];
    const number = args[4];

    const person = new Person({
        name: name,
        number: number
    })

    person.save().then((result)=>{
        console.log(`added ${result.name} number ${result.number} to phonebook`);
        mongoose.connection.close();
    })
}
