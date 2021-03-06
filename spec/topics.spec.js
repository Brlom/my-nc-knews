process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const db = require('../db/connection');

describe('/api/topics', () => {
  beforeEach(() => db.migrate.rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run()));
  // currently topics.spec.js is the last file to run, therefore they destroy connection after this.
  after(() => db.destroy());
  it('GET returns 200 and topics array with topics objects', () => request
    .get('/api/topics')
    .expect(200)
    .then(({ body }) => {
      expect(body).to.have.all.keys('topics');
      expect(body.topics.length).to.equal(2);
      expect(body.topics[0]).to.be.an('object');
      expect(body.topics[0]).to.have.all.keys(
        'slug',
        'description',
      );
    }));
  it('GET returns 404 and an error message', () => request
    .get('/api/topics/djfsfjdsf')
    .expect(404));
  it('Non-existent method returns 405 and an error message', () => {
    const url = '/api/topics';
    const methods = [request.put(url), request.patch(url), request.delete(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
  it('POST returns 201 and new topic object', () => {
    const newTopic = {
      slug: 'chuckNorris',
      description: 'You don\'t find him, he find\'s you',
    };
    return request
      .post('/api/topics')
      .send(newTopic)
      .expect(201)
      .then(({ body }) => {
        expect(body.topic).to.be.an('object');
        expect(body.topic).to.have.all.keys('slug', 'description');
      });
  });
  it('POST returns 201 and new topic object', () => {
    const newTopic = {
      slug: 'chuckNorris',
      description: 'You don\'t find him, he find\'s you',
    };
    return request
      .post('/api/topics')
      .send(newTopic)
      .expect(201)
      .then(({ body }) => request
        .post('/api/topics')
        .send(newTopic)
        .expect(422));
  });
  it('POST returns 400', () => {
    const newTopic = {
      slg: 'ChuckNorris',
      description: 'You don\'t find him, he find\'s you',
    };
    return request
      .post('/api/topics')
      .send(newTopic)
      .expect(400);
  });
  it('GET returns 200 and an object of all topic articles', () => request
    .get('/api/topics/cats/articles')
    .expect(200)
    .then(({ body }) => {
      expect(body).to.be.an('object');
      expect(body.articles).to.be.an('array');
      expect(body.articles[0]).to.have.all.keys(
        'author',
        'avatar_url',
        'user_id',
        'name',
        'title',
        'body',
        'article_id',
        'votes',
        'comment_count',
        'created_at',
        'topic',
      );
    }));
  it('GET returns 404 when non-existent topic is used', () => request
    .get('/api/topics/shannara/articles')
    .expect(404));
  it('Non-existent method returns 405 and an error message', () => {
    const url = '/api/topics/cats/articles';
    const methods = [request.put(url), request.patch(url), request.delete(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
  it('GET returns 200 and an object where responses are limited', () => {
    const limit = 10;
    return request
      .get(`/api/topics/cats/articles?limit=${limit}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.be.most(limit);
      });
  });
  it('GET returns 200 and an array of objects sorted by date', () => {
    const firstArticleDesc = 'Living in the shadow of a great man';
    const lastArticleDesc = 'Moustache';
    return request
      .get('/api/topics/mitch/articles?sortBy=created_at&limit=11')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.equal(11);
        expect(body.articles[0].title).to.equal(firstArticleDesc);
        expect(body.articles[body.articles.length - 1].title).to.equal(lastArticleDesc);
      });
  });
  it('GET returns 200 and an array of objects sorted in asc order', () => {
    const firstArticleDesc = 'Moustache';
    const lastArticleDesc = 'Living in the shadow of a great man';
    return request
      .get('/api/topics/mitch/articles?sort_ascending=true&limit=11')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.equal(11);
        expect(body.articles[0].title).to.equal(firstArticleDesc);
        expect(body.articles[body.articles.length - 1].title).to.equal(lastArticleDesc);
      });
  });
  it('GET returns 200 and a specified start page', () => request
    .get('/api/topics/mitch/articles?p=4')
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).to.equal(8);
    }));
  it('GET returns 404 and empty object', () => request
    .get('/api/topics/mitch/articles?p=999')
    .expect(404)
    .then(({ body }) => {
      expect(body.articles.length).to.equal(0);
    }));
  it('POST returns 201 and new article', () => {
    const newArticle = {
      title: 'Around the world in 22 seconds',
      body: 'blablablablabla',
      user_id: 1,
    };
    return request
      .post('/api/topics/cats/articles')
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).to.be.an('object');
        expect(body.article).to.have.all.keys('article_id', 'title', 'created_at', 'votes', 'body', 'user_id', 'topic');
      });
  });
  it('POST returns 400 and an error message', () => {
    const newArticle = {
      titl: 'Sweet dreams',
      body: 'Sweet dreams are made of cheese, who am I to dis a brie',
      user_id: 1,
    };
    return request
      .post('/api/topics/cats/articles')
      .send(newArticle)
      .expect(400);
  });
});
