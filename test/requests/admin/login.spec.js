const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should();
const expect = chai.expect;
const bcrypt = require('bcrypt-nodejs')

const app = require('../../../app')
const helpers = require('../../../_helpers');
const db = require('../../../models')

// Admin 登入功能測試檢查
// 1. 帶入正確登入帳號、密碼可以成功登入
// 2. 沒有帶入資訊，會失敗
describe('# Admin::User login request', () => {
  context('go to admin login page', () => {
    // 帶入正確登入帳號、密碼可以成功登入 
    describe('if admin want to log in', () => {
      before(async() => {
        // 在測試資料庫中，新增 mock 資料
        await db.User.create({
          name: 'User1', 
          email: 'User1', 
          account: 'User1', 
          password: bcrypt.hashSync('User1', bcrypt.genSaltSync(10)),
          role: 'admin'
        })
      })

      it('can render index', (done) => {
        // 可以顯示 /admin/signin 的頁面
        request(app)
          .get('/admin/signin')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      it('login successfully', (done) => {
        // 送出 request POST /admin/signin 
        request(app)
          .post('/admin/signin')
          .send('account=User1&password=User1') // 帳號: User1, 密碼: User1
          .set('Accept', 'application/json')
          .expect(302)
          .expect('Location', '/admin/tweets') // 可以正確回到 /admin/tweets 頁面
          .end(function(err, res) {
            if (err) return done(err);
              return done();
            })
      });

      it('login fail', (done) => {
        // 送出 request POST /admin/signin 
        request(app)
          .post('/admin/signin')
          .send('') // 沒有攜帶帳號密碼資訊
          .set('Accept', 'application/json')
          .expect(302)
          .expect('Location', '/admin/signin') // 回到登入頁面
          .end(function(err, res) {
            if (err) return done(err);
              return done();
            })
      });

      
      after(async () => {
        // 清除測試資料庫資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });
    
  });
});