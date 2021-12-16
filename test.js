let tt = {
    a: '1',
    b: '2',
    c: '3',
}

tt.d = true
tt.e = false
tt.f = '7788'

console.log(tt)

const axios = require('axios')

axios.post('http://localhost:3000/tweets', tt)
    .then(res => {
        console.log(res)
    })
    .catch(error => {
        console.log(error)
    })