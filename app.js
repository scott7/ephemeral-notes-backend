const createError = require('http-errors');
const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.json());
app.use(cors());

const { Note } = require('./models/note');

// routes

app.get('/api/find/:__id', async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.__id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).send('Note not found');
    }
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).send('Error fetching note');
  }
});


app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.findAll();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/notes', async (req, res) => {
  const note_body = req.body.note_body
  const id = req.body.id
  const title = req.body.title
  try {
    let savedNote;
    if (!id) {
      // Create a new note
      const newNote = await Note.create({ title: title, note_body: note_body });
      savedNote = newNote;
    } else {
      // Update an existing note
      const [updatedRowsCount] = await Note.update(
        { title, note_body },
        {
          where: { id }
        }
      );

      // Check if any rows were updated
      if (updatedRowsCount > 0) {
        savedNote = await Note.findByPk(id);
      } else {
        return res.status(404).json({ message: 'Note not found' });
      }
    }

    res.json(savedNote);

  } catch (error) {
    console.error('Error in saving note:', error);
    res.status(500).json({ message: 'Error saving note' });
  }
});

app.delete("/api/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findByPk(id);

    if (note) {
      await note.destroy();
      res.sendStatus(204);
    } else {
      res.status(404).json({ message: 'Note not found' });
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

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
