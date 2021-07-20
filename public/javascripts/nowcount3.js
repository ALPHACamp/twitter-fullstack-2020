$(document).ready(function () {
  let count4 = $(".nowcount4").val().length
  $('.now4').text(count4 + '/140')

  $("textarea").keyup(function () {
    count4 = $(".nowcount4").val().length
    $('.now4').text(count4 + '/140')
  })
})