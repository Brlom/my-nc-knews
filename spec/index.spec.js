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
  // after(() => db.destroy());
  it('GET returns 200 and apiEndpoints describer', () => request
    .get('/api')
    .expect(200)
    .then(({ body }) => {
      expect(body).to.have.all.keys('apiEndpoints');
      expect(body.apiEndpoints.apiEndpoints.length).to.equal(8);
      expect(body.apiEndpoints.apiEndpoints[0]).to.haveOwnProperty('/api/topics');
    }));

  describe('/articles', () => {
    it('GET returns 200 and an array of article objects', () => request
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).to.equal(10);
        expect(body).to.be.an('array');
        expect(body[0]).to.have.all.keys(
          'author',
          'title',
          'article_id',
          'votes',
          'comment_count',
          'created_at',
          'topic',
        );
      }));
    it('Non-existent method returns 405 and an error message', () => {
      const url = '/api/articles';
      const methods = [request.put(url), request.patch(url), request.delete(url)];
      return Promise.all(methods.map(object => object.expect(405)));
    });
    it('GET returns 200 and an object where responses are limited', () => {
      const limit = 5;
      return request
        .get(`/api/articles?limit=${limit}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).to.be.most(limit);
        });
    });
    it('GET returns 200 and an array of objects sorted by date', () => {
      const firstArticleDesc = 'Living in the shadow of a great man';
      const lastArticleDesc = 'Moustache';
      return request
        .get('/api/articles?sortBy=created_at&limit=12')
        .expect(200)
        .then(({ body }) => {
          expect(body.length).to.equal(12);
          expect(body[0].title).to.equal(firstArticleDesc);
          expect(body[body.length - 1].title).to.equal(lastArticleDesc);
        });
    });
    it('GET returns 200 and an array of objects sorted in asc order', () => {
      const firstArticleDesc = 'Moustache';
      const lastArticleDesc = 'Living in the shadow of a great man';
      return request
        .get('/api/articles?sort_ascending=true&limit=12')
        .expect(200)
        .then(({ body }) => {
          expect(body.length).to.equal(12);
          expect(body[0].title).to.equal(firstArticleDesc);
          expect(body[body.length - 1].title).to.equal(lastArticleDesc);
        });
    });
    it('GET returns 200 and a specified start page', () => request
      .get('/api/articles?p=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).to.equal(9);
      }));
    it('GET returns 200 and an article object by id', () => request
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body).length).to.equal(7);
        expect(body).to.be.an('object');
        expect(body).to.have.all.keys(
          'author',
          'title',
          'article_id',
          'votes',
          'comment_count',
          'created_at',
          'topic',
        );
      }));
    it('Non-existent method returns 405 and an error message', () => {
      const url = '/api/articles/1';
      const methods = [request.put(url)];
      return Promise.all(methods.map(object => object.expect(405)));
    });
    it('PATCH returns 200 and updates votes', () => {
      const updatedArticle = {
        inc_votes: 2,
      };
      return request
        .patch('/api/articles/1')
        .send(updatedArticle)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body.votes).to.equal(102);
        });
    });
    it('DELETE returns 200 and deletes article, returning empty object', () => request
      .delete('/api/articles/1')
      .expect(200)
      .then(() => request
        .get('/api/articles/1')
        .expect(404)));
    it('GET returns 200 and an array of comments by article id', () => request
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).to.equal(10);
        expect(body).to.be.an('array');
        expect(body[0]).to.have.all.keys(
          'author',
          'votes',
          'comment_id',
          'created_at',
          'body',
        );
      }));
    it('Non-existent method returns 405 and an error message', () => {
      const url = '/api/articles/1/comments';
      const methods = [request.put(url), request.patch(url), request.delete(url)];
      return Promise.all(methods.map(object => object.expect(405)));
    });
    it('GET returns 200 and an object where responses are limited', () => {
      const limit = 5;
      return request
        .get(`/api/articles/1/comments?limit=${limit}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.length).to.be.most(limit);
        });
    });
    it('GET returns 200 and an array of objects sorted by date', () => {
      const firstCommentSubStr = 'The beautiful thing about treasure is that it exists.';
      const lastCommentDesc = 'Massive intercranial brain haemorrhage';
      return request
        .get('/api/articles/1/comments?sortBy=created_at&limit=11')
        .expect(200)
        .then(({ body }) => {
          expect(body.length).to.equal(11);
          expect(body[0].body).to.have.string(firstCommentSubStr);
          expect(body[body.length - 1].body).to.equal(lastCommentDesc);
        });
    });
    it('GET returns 200 and an array of objects sorted by votes', () => {
      const firstCommentSubStr = 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these';
      const lastCommentDesc = 'Fruit pastilles';
      return request
        .get('/api/articles/1/comments?sortBy=votes&limit=11')
        .expect(200)
        .then(({ body }) => {
          // const voteArr = body.map(obj => obj.votes);
          // expect(voteArr).to.
          expect(body.length).to.equal(11);
          expect(body[0].body).to.have.string(firstCommentSubStr);
          expect(body[body.length - 1].body).to.equal(lastCommentDesc);
        });
    });
    it('GET returns 200 and an array of objects sorted in asc order', () => {
      const firstCommentSubStr = 'I hate streaming noses';
      const lastCommentDesc = 'This morning, I showered for nine minutes.';
      return request
        .get('/api/articles/1/comments?sort_ascending=true')
        .expect(200)
        .then(({ body }) => {
          expect(body.length).to.equal(10);
          expect(body[0].body).to.equal(lastCommentDesc);
          expect(body[body.length - 1].body).to.equal(firstCommentSubStr);
        });
    });
    it('GET returns 200 and a specified start page', () => request
      .get('/api/articles/1/comments?limit=5&?p=3')
      .expect(200)
      .then(({ body }) => {
        expect(body.length).to.equal(5);
      }));
    it('POST returns 201 and new comment by article id', () => {
      const newComment = {
        body: 'home, home on the range..',
        user_id: 1,
      };
      return request
        .post('/api/articles/1/comments')
        .send(newComment)
        .expect(201)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body).to.have.all.keys('comment_id', 'user_id', 'article_id', 'created_at', 'votes', 'body');
          expect(body.article_id).to.equal(1);
        });
    });
    it('PATCH returns 200 and updates votes', () => {
      const updatedComment = {
        inc_votes: 2,
      };
      return request
        .patch('/api/articles/1/comments/2')
        .send(updatedComment)
        .expect(200)
        .then(({ body }) => {
          expect(body).to.be.an('object');
          expect(body.votes).to.equal(-98);
        });
    });
    it('DELETE returns 200 and deletes comment, returning empty object', () => request
      .delete('/api/articles/1/comments/2')
      .expect(200));
  });
  it('Non-existent method returns 405 and an error message', () => {
    const url = '/api/articles/1/comments/2';
    const methods = [request.get(url), request.put(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
  describe('/users', () => {
    it('GET returns 200 and users array with users objects', () => request
      .get('/api/users')
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).to.equal(3);
        expect(body.users).to.be.an('array');
        expect(body.users[0]).to.have.all.keys(
          'user_id',
          'username',
          'avatar_url',
          'name',
        );
      }));
    it('Non-existent method returns 405 and an error message', () => {
      const url = '/api/users';
      const methods = [request.put(url), request.patch(url), request.delete(url)];
      return Promise.all(methods.map(object => object.expect(405)));
    });
    it('GET returns 200 and single user object by id', () => request
      .get('/api/users/rogersop')
      .expect(200)
      .then(({ body }) => {
        expect(body).to.be.an('object');
        expect(body).to.have.all.keys(
          'user_id',
          'username',
          'avatar_url',
          'name',
        );
      }));
    it('GET returns 404 when non-existent username is used', () => request
      .get('/api/users/rango')
      .expect(404));
    it('Non-existent method returns 405 and an error message', () => {
      const url = '/api/users/rango';
      const methods = [request.put(url), request.patch(url), request.delete(url)];
      return Promise.all(methods.map(object => object.expect(405)));
    });
  });
});
