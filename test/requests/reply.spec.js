const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers');
const should = chai.should()
const expect = chai.expect;
const db = require('../../models')

// 測試留言相關功能
// 1. 可否取得留言資料
// 2. 可以新增留言
// 3. 測試沒有相關 models 預先存在的話，新增留言會失敗
describe('# reply request', () => {

  context('#index', () => {
    // 可否取得留言資料
    describe('GET /tweets/:id/replies', () => {
      before(async() => {
        // 模擬登入資料
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});

        // 在測試資料庫中，確保 db 資料清空了
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Reply.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({})
        await db.Tweet.create({UserId: 1, description: 'test'})
        await db.Reply.create({UserId: 1, TweetId: 1, comment: 'Tweet1 的 comment'})
      })

      it('should render index', (done) => {
        // 確認 GET /tweets/1/replies 可以顯示留言
        request(app)
          .get('/tweets/1/replies')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 確認顯示的留言中有 Tweet1 的 comment 這個資訊
            res.text.should.include('Tweet1 的 comment')
            return done();
          });
      })

      after(async () => {
        // 清除驗證資料以及測試 db 資料 
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Tweet.destroy({where: {},truncate: true, force: true})
        await db.Reply.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
  })

  context('#post', () => {
    // 可以新增留言     
    describe('POST /tweets/1/replies successfully', () => {
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
      })

      it('POST /tweets/1/replies', (done) => {
        // 送出 request POST /tweets/1/replies
        request(app)
          .post('/tweets/1/replies')
          .send('comment=comment') // 留言內容是 comment
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })

      it('when successfully save', (done) => {
        // 讀取測試資料庫的 Reply table 所有資料
        db.Reply.findOne({where: {UserId: 1}}).then(reply => {
          // 檢查這個 table 不是空的，表示有新增資料進去
          expect(reply).to.not.be.null
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
        await db.Reply.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })

    // 測試沒有相關 models 預先存在的話，新增留言會失敗
    describe('POST /tweets/1/replies fail', () => {
      before(async() => {
        // 沒有預先新增驗證及測試資料庫資料
      })

      it('POST /tweets/1/replies', (done) => {
        // 送出 request POST /tweets/1/replies 
        request(app)
          .post('/tweets/1/replies')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            return done();
          });
      })

      after(async () => {
        // 沒有資料需要清除
      })
    })
  })
});