let addTwwetButton = document.querySelector('#add-tweet-btn')
let descriptionModal = document.querySelector('#description-modal')
let infomation = document.querySelector('#add-tweet-info')
descriptionModal.addEventListener('input', function check(event) {
  console.log(descriptionModal.value) //console.log(descriptionModal.classList) if (descriptionModal.value.length < 1) {
  descriptionModal.classList.add('is-invalid')
  infomation.innerText = '內容不可空白'

  if (descriptionModal.value.length > 0) {
    descriptionModal.classList.remove('is-invalid')
    infomation.innerText = `${descriptionModal.value.length} / 140`
  }
})

addTwwetButton.addEventListener('click', function check(event) {
  console.log('***event.target***', event.target)
  if (descriptionModal.value.length < 1) {
    descriptionModal.classList.add('is-invalid')
  }
  if (descriptionModal.value.length > 1) {
    descriptionModal.classList.remove('is-invalid')
  }
})
