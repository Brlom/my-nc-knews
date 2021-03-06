process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

const request = supertest(app);
const db = require('../db/connection');

describe('/api/articles', () => {
  beforeEach(() => db.migrate.rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run()));
  it('GET returns 200 and an array of article objects', () => request
    .get('/api/articles')
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).to.equal(10);
      expect(body).to.be.an('object');
      expect(body.articles[0]).to.have.all.keys(
        'author',
        'avatar_url',
        'name',
        'user_id',
        'title',
        'article_id',
        'body',
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
        expect(body.articles.length).to.be.most(limit);
      });
  });
  it('GET returns 200 and an array of objects sorted by date', () => {
    const firstArticleDesc = 'Living in the shadow of a great man';
    const lastArticleDesc = 'Moustache';
    return request
      .get('/api/articles?sort_by=created_at&limit=12')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.equal(12);
        expect(body.articles[0].title).to.equal(firstArticleDesc);
        expect(body.articles[body.articles.length - 1].title).to.equal(lastArticleDesc);
      });
  });
  it('GET returns 200 and an array of objects sorted in asc order', () => {
    const firstArticleDesc = 'Moustache';
    const lastArticleDesc = 'Living in the shadow of a great man';
    return request
      .get('/api/articles?sort_ascending=true&limit=12')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.equal(12);
        expect(body.articles[0].title).to.equal(firstArticleDesc);
        expect(body.articles[body.articles.length - 1].title).to.equal(lastArticleDesc);
      });
  });
  it('GET returns 200 and a specified start page', () => request
    .get('/api/articles?p=4')
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).to.equal(9);
    }));
  it('GET returns 200 and an article object by id', () => request
    .get('/api/articles/1')
    .expect(200)
    .then(({ body }) => {
      expect(Object.keys(body).length).to.equal(11);
      expect(body).to.be.an('object');
      expect(body).to.have.all.keys(
        'author',
        'avatar_url',
        'user_id',
        'name',
        'title',
        'article_id',
        'body',
        'votes',
        'comment_count',
        'created_at',
        'topic',
      );
    }));
  it('GET returns 400 and an error message', () => request
    .get('/api/articles/sfsdf')
    .expect(400));
  it('GET returns 404 and an error message', () => request
    .get('/api/topics/999')
    .expect(404));
  it('Non-existent method returns 405 and an error message', () => {
    const url = '/api/articles/1';
    const methods = [request.put(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
  it('GET returns 200 and an array of article objects', () => request
    .get('/api/articles/user/rogersop')
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).to.equal(3);
      expect(body).to.be.an('object');
      expect(body.articles[0]).to.have.all.keys(
        'author',
        'avatar_url',
        'name',
        'user_id',
        'title',
        'article_id',
        'body',
        'votes',
        'comment_count',
        'created_at',
        'topic',
      );
    }));
  it('Non-existent method returns 405 and an error message', () => {
    const url = '/api/articles/user/rogersop';
    const methods = [request.post(url), request.put(url), request.patch(url), request.delete(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
  it('GET returns 200 and an object where responses are limited', () => {
    const limit = 2;
    return request
      .get(`/api/articles/user/rogersop?limit=${limit}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.be.most(limit);
      });
  });
  it('GET returns 200 and an array of objects sorted by date', () => {
    const firstArticleDesc = 'Student SUES Mitch!';
    const lastArticleDesc = 'UNCOVERED: catspiracy to bring down democracy';
    return request
      .get('/api/articles/user/rogersop?sort_by=created_at&limit=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.equal(2);
        expect(body.articles[0].title).to.equal(firstArticleDesc);
        expect(body.articles[body.articles.length - 1].title).to.equal(lastArticleDesc);
      });
  });
  it('GET returns 200 and an array of objects sorted in asc order', () => {
    const firstArticleDesc = 'Seven inspirational thought leaders from Manchester UK';
    const lastArticleDesc = 'UNCOVERED: catspiracy to bring down democracy';
    return request
      .get('/api/articles/user/rogersop?sort_ascending=true&limit=2')
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).to.equal(2);
        expect(body.articles[0].title).to.equal(firstArticleDesc);
        expect(body.articles[body.articles.length - 1].title).to.equal(lastArticleDesc);
      });
  });
  it('GET returns 200 and a specified start page', () => request
    .get('/api/articles?p=4')
    .expect(200)
    .then(({ body }) => {
      expect(body.articles.length).to.equal(9);
    }));
  it('GET returns 404 and an error message', () => {
    const limit = 5;
    return request
      .get(`/api/articles/999/rogersop?limit=${limit}`)
      .expect(404);
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
  it('PATCH returns 400 and an error message', () => request
    .patch('/api/articles/sfsdf')
    .expect(400));
  it('PATCH returns 404 and an error message', () => request
    .patch('/api/articles/999')
    .expect(404));
  it('DELETE returns 204 and deletes article, returning empty object', () => request
    .delete('/api/articles/1')
    .expect(204)
    .then(() => request
      .get('/api/articles/1')
      .expect(404)));
  it('DELETE returns 400 and error message', () => request
    .delete('/api/articles/sjsjs')
    .expect(400));
  it('DELETE returns 404 and error message', () => request
    .delete('/api/articles/9999999')
    .expect(404));
  it('GET returns 200 and an array of comments by article id', () => request
    .get('/api/articles/1/comments')
    .expect(200)
    .then(({ body }) => {
      expect(body.comments.length).to.equal(10);
      expect(body).to.be.an('object');
      expect(body.comments[0]).to.have.all.keys(
        'author',
        'avatar_url',
        'user_id',
        'name',
        'votes',
        'comment_id',
        'created_at',
        'body',
      );
    }));
  it('GET returns 400 and an error message', () => request
    .get('/api/articles/sfsdf/comments')
    .expect(400));
  it('GET returns 404 and an error message', () => request
    .get('/api/topics/999/comments')
    .expect(404));
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
        expect(body.comments.length).to.be.most(limit);
      });
  });
  it('GET returns 400 and an error message', () => {
    const limit = 5;
    return request
      .get(`/api/articles/sfsdf/comments?limit=${limit}`)
      .expect(400);
  });
  it('GET returns 404 and an error message', () => {
    const limit = 5;
    return request
      .get(`/api/articles/999/comments?limit=${limit}`)
      .expect(404);
  });
  it('GET returns 200 and an array of objects sorted by date', () => {
    const firstCommentSubStr = 'The beautiful thing about treasure is that it exists.';
    const lastCommentDesc = 'Massive intercranial brain haemorrhage';
    return request
      .get('/api/articles/1/comments?sort_by=created_at&limit=11')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).to.equal(11);
        expect(body.comments[0].body).to.have.string(firstCommentSubStr);
        expect(body.comments[body.comments.length - 1].body).to.equal(lastCommentDesc);
      });
  });
  it('GET returns 200 and an array of objects sorted by votes', () => {
    const firstCommentSubStr = 'Replacing the quiet elegance of the dark suit and tie with the casual indifference of these';
    const lastCommentDesc = 'Fruit pastilles';
    return request
      .get('/api/articles/1/comments?sort_by=votes&limit=11')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).to.equal(11);
        expect(body.comments[0].body).to.have.string(firstCommentSubStr);
        expect(body.comments[body.comments.length - 1].body).to.equal(lastCommentDesc);
      });
  });
  it('GET returns 200 and an array of objects sorted in asc order', () => {
    const firstCommentSubStr = 'I hate streaming noses';
    const lastCommentDesc = 'This morning, I showered for nine minutes.';
    return request
      .get('/api/articles/1/comments?sort_ascending=true')
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).to.equal(10);
        expect(body.comments[0].body).to.equal(lastCommentDesc);
        expect(body.comments[body.comments.length - 1].body).to.equal(firstCommentSubStr);
      });
  });
  it('GET returns 200 and a specified start page', () => request
    .get('/api/articles/1/comments?limit=5&?p=4')
    .expect(200)
    .then(({ body }) => {
      expect(body.comments.length).to.equal(5);
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
  it('POST returns 400 and an error message', () => {
    const newComment = {
      body: 'Du skal ikke tro at du er noe',
      id: 1,
    };
    return request
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(400);
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
  it('PATCH returns 400 and an error message', () => request
    .patch('/api/articles/sfsdf/comments/2')
    .expect(400));
  it('PATCH returns 400 and an error message', () => request
    .patch('/api/articles/1/comments/dkdkd')
    .expect(400));
  it('PATCH returns 404 and an error message', () => request
    .patch('/api/articles/999/comments/2')
    .expect(404));
  it('PATCH returns 404 and an error message', () => request
    .patch('/api/articles/1/comments/999')
    .expect(404));
  it('DELETE returns 204 and deletes comment, returning empty object', () => request
    .delete('/api/articles/1/comments/2')
    .expect(204));
  it('DELETE returns 400 and an error message', () => request
    .delete('/api/articles/sfsdf/comments/2')
    .expect(400));
  it('DELETE returns 400 and an error message', () => request
    .delete('/api/articles/1/comments/dkdkd')
    .expect(400));
  it('DELETE returns 404 and an error message', () => request
    .delete('/api/articles/999/comments/2')
    .expect(404));
  it('DELETE returns 404 and an error message', () => request
    .delete('/api/articles/1/comments/999')
    .expect(404));
  it('Non-existent method returns 405 and an error message', () => {
    const url = '/api/articles/1/comments/2';
    const methods = [request.get(url), request.put(url)];
    return Promise.all(methods.map(object => object.expect(405)));
  });
});
