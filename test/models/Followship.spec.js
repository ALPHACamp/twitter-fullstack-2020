var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const FollowshipModel = require('../../models/followship')

describe('# Followship Model', () => {
  before(done => {
    done()
  })

  const Followship = FollowshipModel(sequelize, dataTypes)
  const followship = new Followship()
  checkModelName(Followship)('Followship')

  context('properties', () => {
    ;[
      'FollowerId', 'FollowingId'
    ].forEach(checkPropertyExists(followship))
  })
})

// const { expect } = require('chai')
// const { spy } = require('sinon')
// const proxyquire = require('proxyquire')
// const { sequelize, Sequelize } = require('sequelize-test-helpers')
// const chai = require('chai')
// const sinonChai = require('sinon-chai')

// chai.use(sinonChai)

// describe('../../models/followship', () => {
//   const { DataTypes } = Sequelize
//   const FollowshipFactory = proxyquire('../../models/followship', {
//     sequelize: Sequelize
//   })
//   let Followship
//   before(() => {
//     Followship = FollowshipFactory(sequelize, DataTypes)
//   })
//   after(() => {
//     Followship.init.resetHistory()
//   })
//   context('properties', () => {
//     it('called Followship.init with the correct parameters', () => {
//       expect(Followship.init).to.have.been.calledWith(
//         {
//           FollowerId: DataTypes.INTEGER,
//           FollowingId: DataTypes.INTEGER
//         },
//         {
//           sequelize,
//           modelName: 'Followship'
//         }
//       )
//     })
//   })
// })
