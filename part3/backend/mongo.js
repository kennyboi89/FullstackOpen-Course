const mongoose = require("mongoose");

const password = process.argv[2];
const url = `mongodb+srv://ken:${password}@phonebook.1jupkiu.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Phonebook = mongoose.model("Phonebook", phonebookSchema);

const getAll = () => {
  Phonebook.find({}).then((result) => {
    result.forEach((note) => {
      console.log(note);
    });
    mongoose.connection.close();
  });
};

const addEntry = () => {
  const name = process.argv[3];
  const phonenumber = process.argv[4];

  const phonebook = new Phonebook({
    name: name,
    number: phonenumber,
  });

  phonebook.save().then((result) => {
    console.log(
      `Added ${phonebook.name} - ${phonebook.number} to the phonebook`
    );
    mongoose.connection.close();
  });
};

if (process.argv.length === 3) {
  getAll();
} else if (process.argv.length === 5) {
  addEntry();
} else {
  console.log("3 or 5 args required: node mongo.js password (Name and PhoneNumber)");
  process.exit(1);
}
