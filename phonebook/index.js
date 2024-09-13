const express = require("express");
const morgan = require("morgan")
const app = express();
const cors = require('cors')

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(morgan('tiny'))
app.use(cors());
app.use(express.static("dist"));

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};


app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/", (request, response) => {
  response.send("<h1>Welcome to Phonebook</h1>");
});

app.get("/info", (request, response) => {
  let length = persons.length;
  let date = new Date(Date.now());
  console.log(response.date);
  response.send(
    `<p>Phonebook has info for ${length} people</p>
    <p>${date}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

function getRandomID() {
  return Math.floor(Math.random() * 10000);
}

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  } else if (
    persons.some((person) => person.name === body.name) ||
    persons.some((person) => person.number === body.number)
  ) {
    return response.status(400).json({
      error: "Name or number already in phonebook",
    });
  }

  const person = {
    id: getRandomID(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(persons);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
