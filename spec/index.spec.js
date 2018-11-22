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
    it('GET returns 200 and an object of all topic articles', () => {
      return request
        .get('/api/topics/cats/articles')
        .expect(200)
        .then(({ body }) => {
          expect(body).to.have.all.keys('articles');
          expect(body.articles).to.be.an('object');
          expect(body.articles).to.have.all.keys(
            // 'author',
            'title',
            'article_id',
            'votes',
            // 'comment_count',
            'created_at',
            'topic'
          );
        });
    });
    it('GET returns 200 and an object where responses are limited', () => {
      const limit = 10;
      return request
        .get('/api/topics/cats/articles?limit=10')
        .expect(200)
        .then(({ body }) => {
          const ol = Object.keys(body.articles);
          expect(ol.length).to.be.below(limit);
        });
    });
    it('GET returns 200 and an array of objects which is sorted by date', () => {
      const firstArticleDesc = 'Living in the shadow of a great man';
      const lastArticleDesc = 'Moustache';
      return request
        .get('/api/topics/mitch/articles?sortBy=created_at')
        .expect(200)
        .then((body) => {
          expect(body.articles[0].title).to.equal(firstArticleDesc);
          expect(body.articles[-1].title).to.equal(lastArticleDesc);
        })
    })
  });
});
