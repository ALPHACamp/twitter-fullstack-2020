$(document).ready(function () {
  $('#account').keyup(function () {
    const account = $('#account').val()

    if (account !== '') {
      $.ajax({
        data: { account: account },
        url: '/check',
        type: 'post',
        success: (data) => {
          if (data.status === 1) {
            $('#status').html(`<p class="p-1" style="color: #00FF00">${data.check}</p>`)
          } else {
            $('#status').html(`<p class="p-1" style="color: #FF0000">${data.check}</p>`)
          }
        }
      })
    }
  })
})

