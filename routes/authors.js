const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');


// Show All Authors
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i');
  }

  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index', {authors: authors, searchOptions: req.query});
  } catch (err) {
    res.redirect('/');
  }
});

router.get('/new', (req, res) => {
  res.render('authors/new', {author: new Author()});
});

// Create New Author
router.post('/', async (req, res) => {
  const author = new Author({
    name: req.body.name,
    country: req.body.country,
    genre: req.body.genre
  });

  try {
    const newAuthor = await author.save();
    res.redirect(`authors/${newAuthor.id}`);
  } catch (err) {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating author',
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Book.find({ author: author.id }).limit(6).exec()
    console.log(author);
    res.render('authors/show', {
      author,
      country: author.country,
      genre: author.genre,
      booksByAuthor: books
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    console.log(author)
    res.render('authors/edit', {
      author: author,
      country: author.country,
      genre: author.country
    });
  } catch (err) {
    res.redirect('/authors');
  }
});



router.put('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;

    await author.save();
    res.redirect(`/authors/${author.id}`);
  } catch (err) {
    if (author == null) {
      res.redirect('/');
    } else {
      res.render('authors/edit', {
        author: author,
        errorMessage: 'Error updating author',
      });
    }
  }
});

router.delete('/:id', async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.remove();
    res.redirect('/authors');
  } catch {
    if (author == null) {
      res.redirect('/');
    } else {
      res.redirect(`/authors/${author.id}`);
    }
  }
});

module.exports = router;
