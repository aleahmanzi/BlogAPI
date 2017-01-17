const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const jsonParser=require('body-parser').json();

const {BlogPosts} = require('./models');

console.log('top of blog post router');

// EXISITING BLOG POSTS

BlogPosts.create('First Post', 'This is my first post', 'Aleah Manzi', '1/10/17');
BlogPosts.create('Second Post', 'This is my second post', 'Aleah Manzi', '1/12/17');
BlogPosts.create('Third Post', 'This is my third post', 'Aleah Manzi', '1/15/17');

// CREATE BLOG POSTS
BlogPosts.create('Fourth Post', 'This is my fourth post', 'Aleah Manzi', '1/20/17');
BlogPosts.create('Fifth Post', 'This is my fifth post', 'Aleah Manzi', '1/25/17');


// GET
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['title', 'content'];
  console.log("the request", req.body);
    for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = BlogPosts.create(req.body.title, req.body.content);
  res.status(201).json(item);
});


// PUT

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating blog post \`${req.params.id}\``);
  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).json(updatedItem);
});

// DELETE

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log(`Deleted Blog post \`${req.params.ID}\``);
  res.status(204).end();
});


module.exports = router;
