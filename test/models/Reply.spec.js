const { expect } = require('chai')
const { spy } = require('sinon')
const proxyquire = require('proxyquire')
const { sequelize, Sequelize } = require('sequelize-test-helpers')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const db = require('../../models')
chai.use(sinonChai)

describe('../../models/Reply', () => {
  const { DataTypes } = Sequelize
  const ReplyFactory = proxyquire('../../models/Reply', {
    sequelize: Sequelize
  })
  let Reply
  console.log(ReplyFactory(sequelize, DataTypes).associate)
  before(() => {
    Reply = ReplyFactory(sequelize, DataTypes)
  })
  after(() => {
    Reply.init.resetHistory()
  })

  context('properties', () => {
    it('called Followship.init with the correct parameters', () => {
      expect(Reply.init).to.have.been.calledWith(
        {
          UserId: DataTypes.INTEGER,
          TweetId: DataTypes.INTEGER,
          comment: DataTypes.TEXT,
          likeCount: DataTypes.INTEGER
        },
        {
          sequelize,
          modelName: 'Reply'
        }
      )
    })
  })
  context('associations', () => {
    before(() => {
      Reply.associate(db.User)
    })

    it('should belong to user', (done) => {
      expect(Reply.belongsTo).to.have.been.calledWith(db.User)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Reply.create({}).then((reply) => {
        data = reply
        done()
      })
    })
    it('read', (done) => {
      db.Reply.findByPk(data.id).then((reply) => {
        expect(data.id).to.be.equal(reply.id)
        done()
      })
    })
    it('update', (done) => {
      db.Reply.update({}, { where: { id: data.id } }).then(() => {
        db.Reply.findByPk(data.id).then((reply) => {
          expect(data.updatedAt).to.be.not.equal(reply.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Reply.destroy({ where: { id: data.id } }).then(() => {
        db.Reply.findByPk(data.id).then((reply) => {
          expect(reply).to.be.equal(null)
          done()
        })
      })
    })
  })
})

// var chai = require('chai');
// var sinon = require('sinon');
// chai.use(require('sinon-chai'));

// const { expect } = require('chai')
// const {
//   sequelize,
//   dataTypes,
//   checkModelName,
//   checkUniqueIndex,
//   checkPropertyExists
// } = require('sequelize-test-helpers')

// const db = require('../../models')
// const ReplyModel = require('../../models/reply')

// describe('# Reply Model', () => {

//   before(done => {
//     done()
//   })

//   const Reply = ReplyModel(sequelize, dataTypes)
//   const like = new Reply()
//   checkModelName(Reply)('Reply')

//   context('properties', () => {
//     ;[
//     ].forEach(checkPropertyExists(like))
//   })

//   context('associations', () => {
//     const User = 'User'
//     const Tweet = 'Tweet'
//     before(() => {
//       Reply.associate({ User })
//       Reply.associate({ Tweet })
//     })

//     it('should belong to user', (done) => {
//       expect(Reply.belongsTo).to.have.been.calledWith(User)
//       done()
//     })
//     it('should belong to tweet', (done) => {
//       expect(Reply.belongsTo).to.have.been.calledWith(Tweet)
//       done()
//     })
//   })

//   context('action', () => {

//     let data = null

//     it('create', (done) => {
//       db.Reply.create({}).then((reply) => {
//         data = reply
//         done()
//       })
//     })
//     it('read', (done) => {
//       db.Reply.findByPk(data.id).then((reply) => {
//         expect(data.id).to.be.equal(reply.id)
//           done()
//         })
//     })
//     it('update', (done) => {
//       db.Reply.update({}, { where: { id: data.id }}).then(() => {
//         db.Reply.findByPk(data.id).then((reply) => {
//           expect(data.updatedAt).to.be.not.equal(reply.updatedAt)
//           done()
//         })
//       })
//     })
//     it('delete', (done) => {
//       db.Reply.destroy({ where: { id: data.id }}).then(() => {
//         db.Reply.findByPk(data.id).then((reply) => {
//           expect(reply).to.be.equal(null)
//           done()
//         })
//       })
//     })
//   })
// })
