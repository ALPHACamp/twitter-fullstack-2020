// import Swal from 'sweetalert2'
const axios = require('axios')

const baseURL = 'http://localhost:3000'

const apiHelper = axios.create({
  baseURL
})

module.exports = apiHelper

// export const Toast = Swal.mixin({
//   toast: true,
//   position: 'top-end',
//   showConfirmButton: false,
//   timer: 3000
// })