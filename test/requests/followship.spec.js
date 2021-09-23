var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should()
const db = require('../../models')

describe('# followship request', () => {

  context('#create', () => {
    describe('when user1 wants to follow user2', () => {
      before(async () => {
        console.log('剛進入 before when user1 wants to follow user2 ')
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, Followings: [] });
        console.log('執行完helper before when user1 wants to follow user2 ')
        await db.User.destroy({ where: {}, truncate: true })
        await db.Followship.destroy({ where: {}, truncate: true })
        await db.User.create({})
        await db.User.create({})
        console.log('執行完 all await before when user1 wants to follow user2 ')
      })

      it('can not follow self', (done) => {
        console.log('剛進入in it can not follow self')
        request(app)
          .post('/followships')
          .send('id=1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            if (err) return done(err);
            console.log('執行完路由功能in it can not follow self')
            db.User.findByPk(1, {
              include: [
                { model: db.User, as: 'Followers' },
                { model: db.User, as: 'Followings' }
              ]
            }).then(user => {
              user.Followings.length.should.equal(0)
              console.log('in it can not follow self before done')
              return done();
            })
          });
      })

      it('will show followings', (done) => {
        request(app)
          .post('/followships')
          .send('id=2')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function (err, res) {
            if (err) return done(err);
            db.User.findByPk(1, {
              include: [
                { model: db.User, as: 'Followers' },
                { model: db.User, as: 'Followings' }
              ]
            }).then(user => {
              user.Followings.length.should.equal(1)
              return done();
            })
          });
      })

      after(async () => {

        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({ where: {}, truncate: true })
        await db.Followship.destroy({ where: {}, truncate: true })
      })
    })
  })

  context('#destroy', () => {
    describe('when user1 wants to unfollow user2', () => {
      before(async () => {

        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({ id: 1, Followings: [] });
        await db.User.destroy({ where: {}, truncate: true })
        await db.Followship.destroy({ where: {}, truncate: true })
        await db.User.create({})
        await db.User.create({})
        await db.Followship.create({ followerId: 1, followingId: 2 })
      })

      it('will update followings index', (done) => {
        request(app)
          .delete('/followships/2')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function (err, res) {
            if (err) return done(err);
            db.User.findByPk(1, {
              include: [
                { model: db.User, as: 'Followers' },
                { model: db.User, as: 'Followings' }
              ]
            }).then(user => {
              user.Followings.length.should.equal(0)
              return done();
            })
          });
      })

      after(async () => {

        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({ where: {}, truncate: true })
        await db.Followship.destroy({ where: {}, truncate: true })
      })
    })
  })

});