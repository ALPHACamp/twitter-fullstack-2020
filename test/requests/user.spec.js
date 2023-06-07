const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers');
const should = chai.should()
const db = require('../../models')

// 使用者相關功能測試
// 1. 可以瀏覽自己的貼文頁面
// 2. 可以瀏覽其他人的貼文頁面
// 3. 可以瀏覽編輯使用者頁面
// 4. 不可瀏覽編輯他人的頁面
// 5. 可以更新使用者的資訊
// 6. 可以顯示所有追蹤的人資訊
// 7. 可以顯示所有被追蹤的資訊
// 8. 追蹤者資訊依據新增時間排序
// 9. 可以顯示使用者喜愛的貼文清單

describe('# user request', () => {
  context('# tweets', () => {
    before(async() => {
      // 模擬登入資料
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Followings: [], role: 'user'});

      // 確保清除了測試資料庫中的 User, Tweet 資料
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
      await db.User.destroy({where: {},truncate: true, force: true})
      await db.Tweet.destroy({where: {},truncate: true, force: true})
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      // 在測試資料庫中，新增 mock 資料
      await db.User.create({})
      await db.User.create({})
      await db.Tweet.create({UserId: 1, description: 'User1 的 Tweet'})
      await db.Tweet.create({UserId: 2, description: 'User2 的 Tweet'})
    })

    // 可以瀏覽自己的貼文頁面
    describe('go to current_user page', () => {
      it('will show current users tweets', (done) => {
        // 送出 GET /users/1/tweets
        request(app)
          .get('/users/1/tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否含有標題 User1 的 Tweet 內容
            res.text.should.include('User1 的 Tweet')
            return done();
          });
      })
    })
    // 可以瀏覽其他人的貼文頁面
    describe('go to other user page', () => {
      it('will show other users tweets', (done) => {
        // 送出 GET /users/2/tweets
        request(app)
          .get('/users/2/tweets')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否含有標題 User2 的 Tweet 內容 
            res.text.should.include('User2 的 Tweet')
            return done();
          });
      })
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

  context('# edit', () => {
    before(async() => {
      // 模擬登入資料
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
      // 在測試資料庫中，新增 mock 資料
      await db.User.create({name: 'User1'})
      await db.User.create({name: 'User2'})
    })
    
    // 可以瀏覽編輯使用者頁面
    describe('go to edit page', () => {
      it('will render edit page', (done) => {
        // 送出 request GET /api/users/1
        request(app)
          .get('/api/users/1')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否成功取得 User1 的內容
            res.body.name.should.equal('User1');
            return done();
          });
      })

      // 不可瀏覽編輯他人的頁面
      it('will redirect if not this user', (done) => {
        // 送出 request GET /api/users/2
        request(app)
          .get('/api/users/2')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否有出現 error 內容
            res.body.status.should.equal('error');
            return done();
          });
      })
    })

    after(async () => {
      // 清除登入及測試資料庫資料 
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
      await db.User.destroy({where: {},truncate: true, force: true})
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      
    })
  })

  context('#update', () => {
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

    // 可以更新使用者的資訊
    describe('successfully update', () => {
      it('will change users intro', (done) => {
        // 送出 request POST /api/users/1
        request(app)
          .post('/api/users/1')
          .send('name=abc')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            db.User.findByPk(1).then(user => {
              // 確認資料是否更新成 abc
              user.name.should.equal('abc');
              return done();
            })
          });
      })
    })

    after(async () => {
      // 清除登入及測試資料庫資料 
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
      await db.User.destroy({where: {},truncate: true, force: true})
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
    })
  })

  context('#followings #followers', () => {
    before(async() => {
      // 模擬登入資料
      this.ensureAuthenticated = sinon.stub(
        helpers, 'ensureAuthenticated'
      ).returns(true);
      this.getUser = sinon.stub(
        helpers, 'getUser'
      ).returns({id: 1, Followings: [], role: 'user'});
      // 在測試資料庫中，新增 mock 資料
      await db.User.create({name: 'User1'})
      await db.User.create({name: 'User2'})
      await db.User.create({name: 'User3'})

      const date = new Date();
      await db.Followship.create({followerId: 1, followingId: 2})
      await db.Followship.create({followerId: 1, followingId: 3})
      await db.Followship.create({followerId: 2, followingId: 1})
      await db.Followship.create({followerId: 3, followingId: 1})
    })

    // 可以顯示所有追蹤的人的資訊
    describe('go to followings page', () => {
      it('will show all followings users', (done) => {
        // 送出 request GET /users/1/followings
        request(app)
          .get('/users/1/followings')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否含有 User2 的資訊
            res.text.should.include('User2')
            return done();
          });
      })
      // 追蹤者資訊依據新增時間排序
      it('followings list ordered by desc', (done) => {
        // 送出 request GET /users/1/followings
        request(app)
          .get('/users/1/followings')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查 User3 是否在 User2 的前面 
            res.text.indexOf('User3').should.above(res.text.indexOf('User2'))
            return done();
          });
      })
    })
    
    // 可以顯示所有被追蹤的資訊
    describe('go to followers page', () => {
      it('can see followers on other user page', (done) => {
        // 送出 request GET /users/1/followers 
        request(app)
          .get('/users/1/followers')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查 User1 是否有被 User3 追蹤
            res.text.should.include('User3')
            return done();
          });
      })
      // 追蹤者資訊依據新增時間排序
      it('followers list ordered by desc', (done) => {
        // 送出 request GET /users/1/followers 
        request(app)
          .get('/users/1/followers')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查 User3 是否在 User2 的前面 
            res.text.indexOf('User3').should.above(res.text.indexOf('User2'))
            return done();
          });
      })
    })

    after(async () => {
      // 清除登入及測試資料庫資料 
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
      await db.User.destroy({where: {},truncate: true, force: true})
      await db.Followship.destroy({where: {},truncate: true, force: true})
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });

    })
  })

  // 可以顯示使用者喜愛的貼文清單
  context('#likes', () => {
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
      await db.Tweet.create({UserId: 1, description: 'Tweet1'})
      await db.Like.create({UserId: 1, TweetId: 1})
    })

    describe('go to likes page', () => {
      it('show users like tweets', (done) => {
        // 送出 request GET /users/1/likes 
        request(app)
          .get('/users/1/likes')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否喜愛的貼文裡有 Tweet1
            res.text.should.include('Tweet1')
            return done();
          });
      })
    })

    after(async () => {
      // 清除登入及測試資料庫資料 
      this.ensureAuthenticated.restore();
      this.getUser.restore();
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
      await db.User.destroy({where: {},truncate: true, force: true})
      await db.Tweet.destroy({where: {},truncate: true, force: true})
      await db.Like.destroy({where: {},truncate: true, force: true})
      await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
    })
  })
});
