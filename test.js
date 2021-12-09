const faker = require('faker')
let a = []
let usersId = [11, 21, 31, 41, 51]
for (let i = 0; i < 9; i++) {
    a.push(Array.from(usersId).map((d, i) => ({
        description: faker.lorem.text(),
        UserId: d
    })))
}

console.log(a)