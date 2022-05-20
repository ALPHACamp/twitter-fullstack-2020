const editModal = document.querySelector('#editProfileModal')
const inputNameCounts = document.querySelector('.nameCounts')
const inputIntroductionCounts = document.querySelector('.introductionCounts')
const inputName = document.querySelector('#name')
const inputIntroduction = document.querySelector('#introduction')
const editButton = document.querySelector('#editButton')
//計算按鍵放開時的字數
editModal.addEventListener('keyup', function (event) {
  const target = event.target
  const inputValue = target.value || ''
  if (target.matches('#name')) {
    inputNameCounts.innerText = inputValue.length
  } else {
    inputIntroductionCounts.innerText = inputValue.length
  }
})
//計算按下按鍵時的字數，顯示長按時的字數變化
editModal.addEventListener('keydown', function (event) {
  const target = event.target
  const inputValue = target.value || ''
  if (target.matches('#name')) {
    inputNameCounts.innerText = inputValue.length
  } else {
    inputIntroductionCounts.innerText = inputValue.length
  }
})
//點擊按鈕時，顯示內容之字數
editButton.addEventListener('click', function(event){
  const target = event.target
  const UserId = target.dataset.id
  axios
  .get(`http://localhost:3000/api/users/${UserId}`)
  .then(res => {
    inputIntroductionCounts.innerText = res.data.introduction.length
    inputNameCounts.innerText = res.data.name.length
  })
  .catch(err => console.log(err))
})



