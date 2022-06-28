const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers');
const should = chai.should();
const expect = chai.expect;
const db = require('../../models')

// 貼文功能測試
// 1. 當 user 沒有登入時，進到 /tweets 頁面會被導回到首頁
// 2. 當 user 登入時，可以進到 /tweets 頁面
// 3. 可以新增貼文
// 4. 可以喜愛/不喜愛貼文
describe('# tweet request', () => {
  context('# index', () => {
    // 當 user 沒有登入時，進到 /tweets 頁面會被導回到首頁
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

    // 當 user 登入時，可以進到 /tweets 頁面
    describe('user log in', () => {
      before(async() => {
        // 模擬登入資料
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({})
        await db.Tweet.create({UserId: 1, description: 'User1 的 Tweet1'})
        await db.Tweet.create({UserId: 1, description: 'User1 的 Tweet2'})
      })

      it('can render index', (done) => {
        // 送出 request GET /tweets
        request(app)
          .get('/tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            res.text.should.include('User1 的 Tweet1')
            res.text.should.include('User1 的 Tweet2')
            return done();
          });
      })

      after(async () => {
        // 清除登入及測試資料庫資料 
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
  })

  // 可以新增貼文
  context('# post', () => {
    describe('when successfully save', () => {
      before(async() => {
        // 模擬登入資料
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({})
      })
      it('POST /tweets', (done) => {
        // 送出 request POST /tweets
        request(app)
          .post('/tweets')
          .send('description=description') // 貼文內容
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })
      it('will create current users tweet', (done) => {
        // 檢查 db 裡面是否有 Tweet 的資料，有的話就不會為空
        db.Tweet.findOne({where: {UserId: 1}}).then(tweet => {
          expect(tweet).to.not.be.null
          done()
        })
      })

      after(async () => {
        // 清除驗證資料以及測試 db 資料
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })

    describe('when failed without login', () => {
      before(async() => {
        // 沒有登入資料
      })

      it('will redirect index', (done) => {
        // 送出 POST /tweets，就會失敗
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
       // 不需清除資料 
      })
    })

    // 測試當貼文內容太多時，新增貼文會失敗
    describe('when failed without validation', () => {
      before(async() => {
        // 模擬登入資料
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({})
      })
      it('will redirect to index', (done) => {
        // 送出 request POST /tweets
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
        // 檢查 db 會發現沒有新增的 tweet，表示太長的貼文不會新增成功
        db.Tweet.findAll({where: {UserId: 1}}).then(tweets => {
          expect(tweets).to.be.an('array').that.is.empty;
          done()
        })
      })

      after(async () => {
        // 清除驗證資料以及測試 db 資料
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
  })

  // 可以喜愛貼文
  context('# like', () => {
    describe('like first tweet', () => {
      before(async() => {
        // 模擬登入資料
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({})
        await db.Tweet.create({UserId: 1})
      })

      it('POST /tweets/1/like', (done) => {
         // 送出 POST /tweets/1/like
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
        // 檢查 db 會發現不是空的，代表新增成功
        db.Like.findOne({where: {UserId: 1}}).then(like => {
          expect(like).to.not.be.null
          done()
        })
      })

      after(async () => {
        // 清除驗證資料以及測試 db 資料
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Like.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
  })

  // 可以不喜愛貼文
  context('# unlike', () => {
    describe('like first tweet', () => {
      before(async() => {
        // 模擬登入資料  
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({})
        await db.Tweet.create({UserId: 1, description: 'test'})
        await db.Like.create({UserId: 1, TweetId: 1})
      })

      it('POST /tweets/1/unlike', (done) => {
        // 送出 POST /tweets/1/unlike
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
        // 檢查 db，會發現喜愛的資料已清除，因此資料回傳是空的
        db.Like.findOne({where: {UserId: 1}}).then(like => {
          expect(like).to.be.null
          done()
        })
      })


      after(async () => {
        // 清除驗證資料以及測試 db 資料
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Like.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
  })

});