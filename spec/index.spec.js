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
    it('GET returns 200 and topics object', () => request
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
  });
  // describe('/users', () => {
  //     it('GET returns 200 and users object', () => {
  //         return request
  //             .get('/api/users')
  //             .expect(200)
  //             .then(({ body }) => {
  //                 expect(body).to.have.all.keys('users');
  //                 expect(body.users.length).to.equal(4);
  //                 expect(body.users[0]).to.be.an('object');
  //                 expect(body.users[0]).to.have.all.keys(
  //                     'user_id',
  //                     'username',
  //                     'avatar_url',
  //                     'name'
  //                 );
  //             })
  //     })
  // })
  // describe('/articles', () => {
  //     it('GET returns 200 and articles object', () => {
  //         return request
  //         .get('/api/articles')
  //         .expect(200)
  //         .then(({ body }) => {
  //             expect(body).to.have.all.keys('articles');
  //             expect(body.articles.length).to.equal(4);
  //             expect(body.articles[0]).to.be.an('object');
  //             expect(body.articles[0]).to.have.all.keys(
  //                 'article_id',
  //                 'title',
  //                 'body',
  //                 'votes',
  //                 'topic',
  //                 'user_id',
  //                 'created_at'
  //             );
  //         })
  //     })
  // })
  // describe('/comments', () => {
  //     it('GET returns 200 and comments object', () => {
  //         return request
  //         .get('/api/comments')
  //         .expect(200)
  //         .then(({ body }) => {
  //             expect(body).to.have.all.keys('comments');
  //             expect(body.comments.length).to.equal(4);
  //             expect(body.comments[0]).to.be.an('object');
  //             expect(body.comments[0]).to.have.all.keys(
  //                 'comment_id',
  //                 'user_id',
  //                 'article_id',
  //                 'votes',
  //                 'created_at',
  //                 'body'
  //             );
  //         })
  //     })
  // })
});
