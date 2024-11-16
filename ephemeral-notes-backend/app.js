const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.SERVER;
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(express.json());
app.use(cors());

const Note = require('./models/note');

// routes

app.get('/api/find/:__id', async (req, res) => {
  console.log('id for get request: ' + req.params.__id);
  try {
    const document = await Note.findById(req.params.__id);
    if (document) {
      res.json(document);
    } else {
      res.status(404).send('Note not found');
    }
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).send('Error fetching note');
  }
});

app.get('/api/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

app.post('/api/notes', async (req, res) => {
  var newNote = false;
  if (!req.body._id) {
    newNote = true;
  }

  try {
    let savedNote;
    if (newNote) {
      const newNote = new Note(req.body);
      savedNote = await newNote.save();
      res.json(savedNote);
    }
    else {
      const query = { _id: req.body._id };
      const update = { ...req.body }; 
      const options = { upsert: true, new: true, runValidators: true };
      savedNote = await Note.findOneAndUpdate(query, update, options);
      res.json(savedNote);
    }
  } catch (error) {
    console.error('Error in upserting note:', error);
    res.status(500).json({ message: 'Error saving note' });
  }
});

app.get("/api/delete/:__id", async (req, res, next) => {
  try {
    const document = await Note.findByIdAndDelete(req.params.__id, { useFindAndModify: false });
  } catch (err) {
    console.log(err);
    res.status(500).send('Unable to delete note');
  }
  res.status(200).send('success');
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // returb the error
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

module.exports = app;

const port = process.env.PORT || 8000;
app.listen(port, function () {
  console.log('app is running at port ' + port + '...')
});
