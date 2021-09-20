var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var should = chai.should();
var expect = chai.expect;
var bcrypt = require('bcryptjs')

var app = require('../../app')
var helpers = require('../../_helpers');
const db = require('../../models')


describe('# login request', () => {

  context('go to login page', () => {
    
    describe('if user want to signin', () => {
      before(async() => {
        await db.User.create({
          name: 'User1', 
          email: 'User1', 
          account: 'User1',
          password: bcrypt.hashSync('User1', bcrypt.genSaltSync(10)),
        })
      })

      it('can render index', (done) => {
        request(app)
          .get('/signin')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      it('login successfully', (done) => {
        request(app)
          .post('/signin')
          .send('account=User1&password=User1')
          .set('Accept', 'application/json')
          .expect(302)
          .expect('Location', '/tweets')
          .end(function(err, res) {
            if (err) return done(err);
              return done();
            })
      });


      it('login fail', (done) => {
        request(app)
          .post('/signin')
          .send('')
          .set('Accept', 'application/json')
          .expect(302)
          .expect('Location', '/signin')
          .end(function(err, res) {
            if (err) return done(err);
              return done();
            })
      });

      
      after(async () => {
        await db.User.destroy({where: {},truncate: true})
      })

    });
    
  });

  context('go to signup page', () => {
    
    describe('if user want to signup', () => {
      before(async() => {
      })

      it('can render index', (done) => {
        request(app)
          .get('/signup')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      it('signup successfully', (done) => {
        request(app)
          .post('/signup')
          .send('account=User1&name=User1&email=User1@example.com&password=User1&checkPassword=User1')
          .set('Accept', 'application/json')
          .expect(302)
          .expect('Location', '/signin')
          .end(function(err, res) {
            if (err) return done(err);
              return done();
            })
      });

      after(async () => {
        await db.User.destroy({where: {},truncate: true})
      })

    });
    
  });


});