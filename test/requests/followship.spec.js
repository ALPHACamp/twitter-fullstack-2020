const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const app = require('../../app')
const helpers = require('../../_helpers');
const should = chai.should()
const db = require('../../models')

// 追蹤功能測試
// 1. 新增 - 可否讓 user1 追蹤 user 2
// 2. 刪除 - 可否讓 user1 取消追蹤 user 2 
describe('# followship request', () => {
  context('#create', () => {
    // 可否讓 user1 追蹤 user 2
    describe('when user1 wants to follow user2', () => {
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
        await db.Followship.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        await db.User.create({})
        await db.User.create({})
      })

      // 測試: 自己不能追蹤自己
      it('can not follow self', (done) => {
        // 送出 request POST /followships
        request(app)
          .post('/followships')
          .send('id=1') // 追蹤自己，所以送出資料為 id = 1
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            // 查詢 user 1 的資料
            db.User.findByPk(1,{include: [
                { model: db.User, as: 'Followers' },
                { model: db.User, as: 'Followings' } 
              ]}).then(user => {
              // 檢查是否沒有追蹤自己的資料
              user.Followings.length.should.equal(0)
              return done();
            })
          });
      })

      // 測試: 可以追蹤 user2
      it('can follow user2', (done) => {
        // 送出 request POST /followships
        request(app)
          .post('/followships')
          .send('id=2') // 追蹤 user2，所以送出資料為 id = 2
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            // 查詢 user 1 的資料
            db.User.findByPk(1,{include: [
                { model: db.User, as: 'Followers' },
                { model: db.User, as: 'Followings' } 
              ]}).then(user => {
              // 檢查是否有多一筆資料
              user.Followings.length.should.equal(1)
              return done();
            })
          });
      })

      after(async () => {
        // 清除驗證資料以及測試 db 資料
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Followship.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
  })

  context('#destroy', () => {
    // 可否讓 user1 取消追蹤 user 2
    describe('when user1 wants to unfollow user2', () => {
      before(async() => {
        // 模擬驗證資料   
        this.ensureAuthenticated = sinon.stub(
          helpers, 'ensureAuthenticated'
        ).returns(true);
        this.getUser = sinon.stub(
          helpers, 'getUser'
        ).returns({id: 1, Followings: [], role: 'user'});
        // 在測試資料庫中，新增 mock 資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Followship.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
        await db.User.create({})
        await db.User.create({})
        await db.Followship.create({followerId: 1, followingId: 2})
      })

      // 測試: 可以取消追蹤 user2
      it('will update followings data number to 0', (done) => {
        // 送出 request DELETE /followships
        request(app)
          .delete('/followships/2')  // 取消追蹤 user2
          .set('Accept', 'application/json')
          .expect(302)
          .end(function(err, res) {
            if (err) return done(err);
            // 查詢 user 1 的資料
            db.User.findByPk(1,{include: [
                { model: db.User, as: 'Followers' },
                { model: db.User, as: 'Followings' } 
              ]}).then(user => {
              // 檢查是否清除了追蹤資料，因此 Followings 資料長度為 0
              user.Followings.length.should.equal(0)
              return done();
            })
          });
      })

      after(async () => {
        // 清除驗證資料以及測試 db 資料 
        this.ensureAuthenticated.restore();
        this.getUser.restore();
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.Followship.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })
    })
  })

});