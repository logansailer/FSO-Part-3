require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const Person = require("./models/person");

app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.static("dist"));

app.get("/", (request, response) => {
  response.send("<h1>Welcome to Phonebook</h1>");
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  let date = new Date(Date.now());
  Person.find({}).then((persons) => {
    response.send(
      `<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>`
    );
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end;
    console.log("deleted");
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const personName = body.name;
  const personNumber = body.number;
  if (personName === undefined || personNumber === undefined) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }

  const person = new Person({
    name: personName,
    number: personNumber || false,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
