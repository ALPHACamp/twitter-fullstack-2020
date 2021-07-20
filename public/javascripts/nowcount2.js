$(document).ready(function () {
  let count3 = $(".nowcount3").val().length
  $('.now3').text(count3 + '/140')

  $("textarea").keyup(function () {
    count3 = $(".nowcount3").val().length
    $('.now3').text(count3 + '/140')
  })
})