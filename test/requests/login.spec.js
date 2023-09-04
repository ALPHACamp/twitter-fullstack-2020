const chai = require('chai')
const request = require('supertest')
const sinon = require('sinon')
const should = chai.should();
const expect = chai.expect;
const bcrypt = require('bcrypt-nodejs')

const app = require('../../app')
const helpers = require('../../_helpers');
const db = require('../../models')

// 登入功能檢查測試
describe('# login request', () => {
  context('go to login page', () => {
    // 檢查是否可以透過 POST /signin 登入
    describe('if user want to signin', () => {
      before(async() => {
        // 在測試資料庫中新增 User1 資料
        await db.User.create({
          name: 'User1', 
          email: 'User1', 
          account: 'User1',
          password: bcrypt.hashSync('User1', bcrypt.genSaltSync(10)),
        })
      })

      it('can render index', (done) => {
        // 確認可以顯示 GET /signin 的頁面
        request(app)
          .get('/signin')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      it('login successfully', (done) => {
        // 送出 request POST /signin
        request(app)
          .post('/signin')
          .send('account=User1&password=User1') // 帳號: User1, 密碼: User1
          .set('Accept', 'application/json')
          .expect(302) // 登入成功後，應該要回傳 302 http status code
          .expect('Location', '/tweets') // 登入成功後，應該要到 /tweets 頁面
          .end(function(err, res) {
            if (err) return done(err);
              return done();
          })
      });

      // 測試: 登入失敗是否會回到 /signin 頁面
      it('login fail', (done) => {
        // 送出 request POST /signin  
        request(app)
          .post('/signin')
          .send('') // 沒有帶任何資料
          .set('Accept', 'application/json')
          .expect(302)
          .expect('Location', '/signin') //  回到登入頁面
          .end(function(err, res) {
            if (err) return done(err);
              return done();
            })
      });
      
      after(async () => {
        // 清除測試 db 中的 User 資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });
    
  });

  context('go to signup page', () => {
    // 可以前往 signup 頁面
    describe('if user want to signup', () => {
      it('can render index', (done) => {
        // 送出 request GET /signup 
        request(app)
          .get('/signup')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      })

      // 可以順利完成註冊
      it('signup successfully', (done) => {
        // 送出 request POST /signup 
        request(app)
          .post('/signup')
          .send('account=User1&name=User1&email=User1@example.com&password=User1&checkPassword=User1') // 註冊資料
          .set('Accept', 'application/json')
          .expect(302)
          .expect('Location', '/signin') // 回到登入頁面
          .end(function(err, res) {
            if (err) return done(err);
              return done();
            })
      });

      after(async () => {
        // 清除測試 db 中的 User 資料
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
        await db.User.destroy({where: {},truncate: true, force: true})
        await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', null, { raw: true });
      })

    });
    
  });


});