require("dotenv").config();
const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
const Phonebook = require("./models/phonebook.js");
const phonebook = require("./models/phonebook.js");
const corsOptions = {
  origin: "*",
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

morgan.token("response", function getResponse(request) {
  return JSON.stringify(request.body);
});

app.use(getBody);
app.use(morgan(":method :url :response-time :response"));

function getBody(request, response, next) {
  request.body;
  next();
}

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response, next) => {
  Phonebook.find({})
  .then((persons) => {
    response.json(persons);
  })
  .catch(error => next(error));
});

app.get("/api/info", (request, response, next) => {
  const timestamp = new Date();
  Phonebook.find({})
  .then((persons) => {
    response.send(
      `Phonebook has info for ${persons.length} people` + `<p>${timestamp}</p>`
    );
  })
  .catch(error => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
  .then(() => {
    console.log("Data deleted");
    response.status(204).end();
  })
  .catch(error => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  if (body.name === undefined) {
    return response.status(400).json({ error: "No content in body" });
  }

  const phonebook = new Phonebook({
    name: body.name,
    number: body.number,
  });

  Phonebook.findOne({name: body.name})
    .then((exists) => {
      if (exists)
      {
        Phonebook.findByIdAndUpdate(exists._id, {number: body.number}, {new: true})
          .then(update => {
            response.json(update)
          })
      }
      else
      {
        phonebook.save().then((saved) => {
          response.json(saved);
        });
      }
    })
    .catch(error => next(error))
});

app.put("/api/persons", (request, response, next) => {
  const body = request.body;
  if (body.name === undefined) {
    return response.status(400).json({ error: "No content in body" });
  }

  const phonebook = new Phonebook({
    name: body.name,
    number: body.number,
  });

  Phonebook.findByIdAndUpdate(body.id, phonebook, {new: true})
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error) )
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  
  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(errorHandler)
app.use(unknownEndpoint)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
