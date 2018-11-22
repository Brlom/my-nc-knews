process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const db = require('../db/connection');

describe('/api', () => {
  beforeEach(() => db.migrate.rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run()));
  after(() => db.destroy());
  it('GET returns 200 and welcome msg', () => request
    .get('/api')
    .expect(200)
    .then(({ body }) => {
      expect(body).to.have.all.keys('msg');
    }));
  describe('/topics', () => {
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
      })
    );
    it('POST returns 201 and new topic object', () => {
      const newTopic = {
        'slug': 'chuckNorris',
        'description': 'You don\'t find him, he find\'s you'
      }
      return request
        .post('/api/topics')
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          expect(body.topic).to.be.an('object');
          expect(body.topic).to.have.all.keys("slug", "description");
        })
    });
    it('GET returns 200 and an object of all topic articles', () => {
      return request
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.all.keys('articles');
          expect(body.articles.length).to.equal(3);
          expect(body.articles[0]).to.be.an('object');
          expect(body.articles[0]).to.have.all.keys(
            // 'author',
            'title',
            'article_id',
            'votes',
            // 'comment_count',
            'created_at',
            'topic'
          );
        })
    })
  })
});
