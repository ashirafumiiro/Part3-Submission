const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);
var uniqueValidator = require('mongoose-unique-validator');


const url = process.env.MONGODB_URI
console.log("url:", url);    
console.log("Connecting to", url);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log("Connected to mongoDB");
    })
    .catch(error=>{
        console.log('error connecting to MongoDB:', error.message);
    })

const personSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true, minlength: 3 },
    number: { type: String, required: true, unique: true, minlength: 8 },
})
personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema);
