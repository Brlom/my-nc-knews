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
