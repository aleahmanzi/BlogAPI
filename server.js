const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const blogPostsRouter = require('./blogPostsRouter');
const app = express();
const PORT = 8080;
const jsonParser = bodyParser.json();

app.use(morgan('common'));
app.use(bodyParser.json());

// you need to import `blogPostsRouter` router and route
// requests to HTTP requests to `/blog-posts` to `blogPostsRouter`
app.use('/blog-posts', blogPostsRouter);

function runServer() {
  return new Promise((resolve, reject) => {
    // mongoose.connect(DATABASE_URL, err => {
    //   if (err) {
    //     return reject(err);
     // }
      server = app.listen(PORT || 8080, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        // mongoose.disconnect();
        reject(err);
      });
    });
  // });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
  // return mongoose.disconnect().then(() => {
      return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  // });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {runServer, app, closeServer};