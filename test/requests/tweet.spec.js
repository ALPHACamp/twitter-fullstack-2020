var chai = require('chai')
var request = require('supertest')
var sinon = require('sinon')
var app = require('../../app')
var helpers = require('../../_helpers');
var should = chai.should();
var expect = chai.expect;
const db = require('../../models')

describe('# tweet request', () => {

  context('# index', () => {
    describe('user not login', () => {
      before((done) => {
        done()
      })

      it('will redirect to log in page', (done) => {
        request(app)
          .get('/tweets')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })
    })
    describe('user log in', () => {
      before(async() => {
        
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        await db.User.create({})
        await db.Tweet.create({UserId: 1, description: 'User1 的 Tweet1'})
        await db.Tweet.create({UserId: 1, description: 'User1 的 Tweet2'})
      })

      it('can render index', (done) => {
        request(app)
          .get('/tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            console.log("🚀 ~ file: tweet.spec.js ~ line 50 ~ .end ~ res", res)
            if (err) return done(err);
            res.text.should.include('User1 的 Tweet1')
            res.text.should.include('User1 的 Tweet2')
            return done();
          });
      })

      after(async () => {
        
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
      })
    })
  })

  context('# post', () => {
    describe('when successfully save', () => {
      before(async() => {
        
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        await db.User.create({})
      })
      it('will redirect to index', (done) => {
        request(app)
          .post('/tweets')
          .send('description=description')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })
      it('will create current users tweet', (done) => {
        db.Tweet.findOne({where: {userId: 1}}).then(tweet => {
          expect(tweet).to.not.be.null
          done()
        })
      })

      after(async () => {
        
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
      })
    })

    describe('when failed without login', () => {
      before(async() => {
        
      })

      it('will redirect index', (done) => {
        request(app)
          .post('/tweets')
          .send('description=description')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      after(async () => {
        
      })
    })

    describe('when failed without validation', () => {
      before(async() => {
        
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        await db.User.create({})
      })
      it('will redirect to index', (done) => {
        request(app)
          .post('/tweets')
          .send('description=臣亮言：先帝創業未半，而中道崩殂。今天下三分，益州疲弊，此誠危急存亡之秋也。然侍衛之臣，不懈於內；忠志之士，忘身於外者，蓋追先帝之殊遇，欲報之於陛下也。誠宜開張聖聽，以光先帝遺德，恢弘志士之氣；不宜妄自菲薄，引喻失義，以塞忠諫之路也。宮中府中，俱為一體，陟罰臧否，不宜異同。若有作姦犯科，及為忠善者，宜付有司，論其刑賞，以昭陛下平明之治，不宜篇私，使內外異法也。')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })
      it('cant create current users tweet', (done) => {
        db.Tweet.findAll({where: {userId: 1}}).then(tweets => {
          expect(tweets).to.be.an('array').that.is.empty;
          done()
        })
      })

      after(async () => {
        
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
      })
    })
  })

  context('# like', () => {
    describe('like first tweet', () => {
      before(async() => {
        
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        await db.User.create({})
        await db.Tweet.create({UserId: 1})
      })

      it('will redirect index', (done) => {
         request(app)
          .post('/tweets/1/like')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })
      it('will save like', (done) => {
        db.Like.findOne({where: {userId: 1}}).then(like => {
          expect(like).to.not.be.null
          done()
        })
      })

      after(async () => {
        
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Like.destroy({where: {},truncate: true})
      })
    })
  })

  context('# unlike', () => {
    describe('like first tweet', () => {
      before(async() => {
        
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: []});
        await db.User.create({})
        await db.Tweet.create({UserId: 1, description: 'test'})
        await db.Like.create({UserId: 1, TweetId: 1})
      })

      it('will redirect index', (done) => {
        request(app)
          .post('/tweets/1/unlike')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })
      it('will delete like', (done) => {
        db.Like.findOne({where: {userId: 1}}).then(like => {
          expect(like).to.be.null
          done()
        })
      })


      after(async () => {
        
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.User.destroy({where: {},truncate: true})
        await db.Tweet.destroy({where: {},truncate: true})
        await db.Like.destroy({where: {},truncate: true})
      })
    })
  })

});