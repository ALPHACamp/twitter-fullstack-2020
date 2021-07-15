$(document).ready(function () {
  let count1 = $(".nowcount1").val().length
  let count2 = $(".nowcount2").val().length
  $('.now1').text(count1 + '/50')
  $('.now2').text(count2 + '/160')

  $("input").keyup(function () {
    count1 = $(".nowcount1").val().length
    $('.now1').text(count1 + '/50')
  })
  $("textarea").keyup(function () {
    count2 = $(".nowcount2").val().length
    $('.now2').text(count2 + '/160')
  })
})