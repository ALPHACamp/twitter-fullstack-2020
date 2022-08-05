const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should();
const expect = chai.expect;

const app = require('../../../app')
const helpers = require('../../../_helpers');
const db = require('../../../models')

// 測試 Admin 與貼文相關功能
// 1. 如果一般使用者想進到管理者頁面，不會看到 tweet 資料
// 2. 如果是 admin 使用者，可進入管理貼文頁面，看到 tweet 資料
// 2. 可以管理貼文頁面看到所有貼文
// 3. 管理者可以刪除貼文
// 4. 管理者不能進到使用者 /tweets 頁面
describe('# Admin::Tweet request', () => {
  context('go to admin user page', () => {
    // 如果一般使用者想進到管理者頁面，不會看到 tweet 資料
    describe('if normal user log in', () => {
      before(async() => {
        // 模擬登入資料
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
        // 在測試資料庫中，新增 mock 資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        await db.User.create({})
      })

      // 一般使用者進到 /admin/tweets 會回到 root path
      it('should redirect to root path', (done) => {
        request(app)
          .get('/admin/tweets')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
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

    describe('if admin user log in', () => {
      before(async() => {
        // 模擬登入資料 
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'admin'});
        // 在測試資料庫中，新增 mock 資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        await db.User.create({})
        await db.User.create({})
        await db.Tweet.create({UserId: 2, description: 'Tweet1'})
      })

      // admin 使用者進到 /admin/tweets 會看到貼文
      it('should see all tweets instance', (done) => {
        request(app)
          .get('/admin/tweets')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 檢查是否看到 Tweet1 資訊
            res.text.should.include('Tweet1')
            done();
          });
      })
      // 管理者可以刪除貼文
      it('can delete other users tweet', (done) => {
        // 送出 request DELETE /admin/tweets/1
        request(app)
          .delete('/admin/tweets/1')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            db.Tweet.findAll().then(tweets => {
              // 檢查是否沒有 Tweet 資料，表示被刪除了
              expect(tweets).to.be.an('array').that.is.empty;
              done()
            })
          });
      })
      // 管理者不能進到使用者 /tweets 頁面
      it('cant go to /tweets page', (done) => {
        // 送出 request GET /tweets
        request(app)
          .get('/tweets')
          .expect(302)
          .expect('Location', '/admin/tweets') // 會回到 /admin/tweets
          .end(function(err, res) {
            if (err) return done(err);
            done();
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
});