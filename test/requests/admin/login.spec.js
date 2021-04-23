var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;
var bcrypt = require('bcrypt-nodejs')

var app = require('../../../app')
var helpers = require('../../../_helpers');
const db = require('../../../models')


describe('# Admin::User login request', () => {

  context('go to admin login page', () => {

    describe('if admin want to log in', () => {
      before(async () => {
        await db.User.create({
          name: 'User1',
          email: 'User1',
          account: 'User1',
          password: bcrypt.hashSync('User1', bcrypt.genSaltSync(10)),
          role: 'admin'
        })
      })

      it('can render index', (done) => {
        request(app)
          .get('/admin/signin')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            done();
          });
      })

      it('login successfully', (done) => {
        request(app)
          .post('/admin/signin')
          .send('account=User1&password=User1')
          .set('Accept', 'application/json')
          .expect(302)
          .expect('Location', '/admin/tweets')
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      });

      it('login fail', (done) => {
        request(app)
          .post('/admin/signin')
          .send('')
          .set('Accept', 'application/json')
          .expect(302)
          .expect('Location', '/admin/signin')
          .end(function (err, res) {
            if (err) return done(err);
            return done();
          })
      });


      after(async () => {
        await db.User.destroy({ where: {}, truncate: true })
      })

    });

  });
});