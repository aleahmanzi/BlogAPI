const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

const should = chai.should();

const {BlogPost} = require('../models');

chai.use(chaiHttp);


describe('BlogPosts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

// GET TEST

  it('should list blog posts on GET', function() {
  	return chai.request(app)
  	.get('/blog-posts')
  	.then(function(res) {
  		res.should.have.status(200);
  		res.should.be.json;
  		res.body.should.be.a('array');
  		res.body.length.should.be.above(0);
  		res.body.forEach(function(item) {
  			item.should.be.a('object');
  			item.should.have.all.keys('id', 'title', 'content', 'author', 'publishDate');
  		});
  	});
  });

// POST TEST

  it('should add a blog post on POST', function() {
  	const newPost = { title: 'blog post 10', content: 'can you believe this is my 10th blog post?'};
  	return chai.request(app)
  	 .post('/blog-posts')
  	 .send(newPost)
  	 .then(function(res) {
  	 	res.should.have.status(201);
  	 	res.should.be.json;
  	 	res.body.should.be.a('object');
  	 	res.body.should.include.keys('id', 'title', 'content');
  	 	res.body.title.should.equal(newPost.title);
  	 	res.body.content.should.equal(newPost.content);
  	 });
  });

  // PUT TEST
  it('should update a blog post on PUT', function() {
    const updateData = {
      title: 'blog post 10',
      content: 'this is blog post 10'
    };
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        updateData.id = res.body[0].id;
        return chai.request(app)
          .put(`/blog-posts/${updateData.id}`)
          .send(updateData)
      })
      .then(function(res) {
        console.log('here is the current body', res.body);
        res.should.have.status(202);
        res.body.should.be.a('object');
        res.body.should.include.keys('id', 'title', 'content');
        res.body.title.should.equal(updateData.title);
        res.body.id.should.equal(updateData.id);
        res.body.content.should.equal(updateData.content);
      });
  });

// DELETE TEST

  it('should delete a blog post on DELETE', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        return chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
      })
      .then(function(res) {
        res.should.have.status(204);
      });
  });
});