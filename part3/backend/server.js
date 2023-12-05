require('dotenv').config();
const express = require("express");
const cors = require('cors')
var morgan = require("morgan");
const Phonebook = require('./models/phonebook.js');
const phonebook = require('./models/phonebook.js');
const corsOptions = {
  origin: '*',
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions))

morgan.token('response', function getResponse (request) {
  return JSON.stringify(request.body)
})

app.use(getBody)
app.use(morgan(':method :url :response-time :response'))

function getBody (request, response, next) {
  request.body
  next()
}

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then(persons => {
    response.json(persons);
  })
});

app.get("/api/info", (request, response) => {
  const timestamp = new Date();

  response.send(
    `Phonebook has info for ${persons.length} people` + `<p>${timestamp}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  Phonebook.findById(request.params.id).then(person => {
    response.json(person)
  })
});

app.delete("/api/persons/:id", (request, response) => {
  
  console.log(request.params.id)
  const id = request.params.id;
  console.log(id)

  Phonebook.deleteOne({_id: id}).then(() => {
    console.log("Data deleted")
    response.status(204).end();
  })
});


app.post("/api/persons", (request, response) => {
  const body = request.body
  if (body.name === undefined)
  {
    return response.status(400).json({error: "No content in body"})
  }

  const phonebook = new Phonebook({
    name: body.name,
    number: body.number
  })

  phonebook.save().then(saved => {
    response.json(saved)
  })
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})