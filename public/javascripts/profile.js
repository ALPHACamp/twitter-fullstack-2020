// 編輯個人檔案：名字
const nameCount = document.querySelector('.nameCount')
const nameInput = document.querySelector('.nameInput')

// 編輯個人檔案：自我介紹
const introductionInput = document.querySelector('.introductionInput')
const introductionCount = document.querySelector('.introductionCount')

// 首頁左欄推文
const descriptionCount = document.querySelector('.descriptionCount')
const descriptionInput = document.querySelector('.descriptionInput')

//首頁上方推文
const home_descriptionCount = document.querySelector('.home-descriptionCount')
const home_descriptionInput = document.querySelector('.home-descriptionInput')


// 字數統計
function countWords(name, wordslimit) {
  if (name === 'name') {
    const total = nameInput.value.length
    return nameCount.innerHTML = `${total}/${wordslimit}`
  } else if (name === 'introduction') {
    const total = introductionInput.value.length
    return introductionCount.innerHTML = `${total}/${wordslimit}`
  } else if (name === 'description') {
    const total = descriptionInput.value.length
    return descriptionCount.innerHTML = `${total}/${wordslimit}`
  } else if (name === "homeDescription") {
    let total = home_descriptionInput.value.length;
    return home_descriptionCount.innerHTML = `${total}/${wordslimit}`
  }
}

