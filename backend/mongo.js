const mongoose = require("mongoose");

const password = process.argv[2];
const newName = process.argv[3];
const newNumber = process.argv[4];

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const url = `mongodb+srv://LoganSailer:${password}@notescluster.va0gv.mongodb.net/?retryWrites=true&w=majority&appName=phonebook`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,  
});

const Person = mongoose.model("Person", personSchema);
const person = new Person({
  name: newName,
  number: newNumber,
});

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log(`added ${newName} number ${newNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("invalid arguments");
  mongoose.connection.close();
}
