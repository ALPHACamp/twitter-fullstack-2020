//編輯個人檔案：名字
const nameCount = document.querySelector('.nameCount')
const nameInput = document.querySelector('.nameInput')

//編輯個人檔案：自我介紹
const introductionInput = document.querySelector('.introductionInput')
const introductionCount = document.querySelector('.introductionCount')

//首頁左欄推文
const descriptionCount = document.querySelector('.descriptionCount')
const descriptionInput = document.querySelector('.descriptionInput')

//字數統計
function countWords(name, wordslimit) {
  if (name === "name") {
    let total = nameInput.value.length;
    return nameCount.innerHTML = `${total}/${wordslimit}`
  } else if (name === "introduction") {
    let total = introductionInput.value.length;
    return introductionCount.innerHTML = `${total}/${wordslimit}`
  } else if (name === "description") {
    let total = descriptionInput.value.length;
    return descriptionCount.innerHTML = `${total}/${wordslimit}`
  }
}






