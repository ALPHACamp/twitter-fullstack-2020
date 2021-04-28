'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')
const helpers = require('../_helpers')

module.exports = {
    up: (queryInterface, Sequelize) => {
        queryInterface.bulkInsert(
            'Users',
            [
                {
                    id: 1,
                    account: 'ROOT',
                    email: 'root@example.com',
                    password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
                    isAdmin: true,
                    name: 'root',
                    avatar: 'https://cdn1.iconfinder.com/data/icons/gardening-flat-1/614/1417_-_Root-512.png',
                    cover:
                        'https://cff2.earth.com/uploads/2019/08/01224933/How-plant-roots-know-to-follow-gravity-730x410.jpg',
                    introduction: faker.lorem.text().substring(0, 30),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 2,
                    account: 'USER1',
                    email: 'user1@example.com',
                    password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
                    isAdmin: false,
                    name: 'user1',
                    avatar: 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png',
                    cover: 'https://i.ytimg.com/vi/vxffHm4wy24/maxresdefault.jpg',
                    introduction: faker.lorem.text().substring(0, 30),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 3,
                    account: 'USER2',
                    email: 'user2@example.com',
                    password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
                    isAdmin: false,
                    name: 'user2',
                    avatar: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png',
                    cover: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Junction_2.svg',
                    introduction: faker.lorem.text().substring(0, 30),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 4,
                    account: 'teemo',
                    email: 'teemo@example.com',
                    password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
                    isAdmin: false,
                    name: 'Teemo',
                    avatar: 'https://ddragon.leagueoflegends.com/cdn/10.15.1/img/profileicon/1630.png',
                    cover:
                        'http://3.bp.blogspot.com/-F20IEMAG9tQ/U1uMBwlDvSI/AAAAAAAATHQ/RTh-ZJkTClg/s1600/Teemo-League-of-Legends-Facebook-Cover-Photos-27.jpg',
                    introduction: faker.lorem.text().substring(0, 30),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 5,
                    account: '123123',
                    email: '123@123',
                    password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
                    isAdmin: false,
                    name: '123',
                    avatar:
                        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZagc7HK9K8xkgWG4exlEUiuLVHo252LD7ow&usqp=CAU',
                    cover: 'https://i.ytimg.com/vi/DHV9ED5D_-I/maxresdefault.jpg',
                    introduction: faker.lorem.text().substring(0, 30),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: 6,
                    account: 'poro',
                    email: 'poro@example.com',
                    password: bcrypt.hashSync('123', bcrypt.genSaltSync(10), null),
                    isAdmin: false,
                    name: 'Poro',
                    avatar: 'https://i.pinimg.com/236x/ea/a6/68/eaa668ece7e463e23e42db4c9bab09b2.jpg',
                    cover:
                        'https://timelinecovers.pro/facebook-cover/download/league-of-legends-Fat_Poro-facebook-cover.jpg',
                    introduction: faker.lorem.text().substring(0, 30),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {}
        )
        // 每個使用者有 10 篇 post
        queryInterface.bulkInsert(
            'Tweets',
            Array.from({ length: 50 }).map((item, index) => ({
                id: index + 1,
                UserId: (index % 5) + 2,
                description: faker.lorem.text().substring(0, 130),
                createdAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 600000000))),
                updatedAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 864000))),
            })),
            {}
        )
        queryInterface.bulkInsert(
            'Likes',
            Array.from({ length: 180 }).map((item, index) => ({
                UserId: (index % 5) + 2,
                TweetId: (index % 49) + 2,
                createdAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 864000))),
                updatedAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 864000))),
            })),
            {}
        )
        // 每篇 post 有隨機 3 個留言者，每個人有 1 則留言
        queryInterface.bulkInsert(
            'Replies',
            Array.from({ length: 150 }).map((item, index) => ({
                TweetId: helpers.randomPost(index),
                UserId: (index % 5) + 2,
                createdAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 864000))),
                updatedAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 864000))),
            })),
            {}
        )
        return queryInterface.bulkInsert(
            'Followships',
            Array.from({ length: 11 }).map((item, index) => ({
                followerId: (index % 5) + 2,
                followingId: helpers.randomFollower(),
                createdAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 864000))),
                updatedAt: new Date(new Date().getTime() - Math.floor(Math.floor(Math.random() * 864000))),
            })),
            {}
        )
    },
    down: (queryInterface, Sequelize) => {
        queryInterface.bulkDelete('Users', null, {})
        queryInterface.bulkDelete('Tweets', null, {})
        return queryInterface.bulkDelete('Replies', null, {})
    },
}
