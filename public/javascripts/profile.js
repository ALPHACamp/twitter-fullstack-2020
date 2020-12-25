const nameCount = document.querySelector('.nameCount')
const nameInput = document.querySelector('.nameInput')

const introductionInput = document.querySelector('.introductionInput')
const introductionCount = document.querySelector('.introductionCount')


function countWords(name, wordslimit) {
  if (name === "name") {
    let total = nameInput.value.length;
    return nameCount.innerHTML = `${total}/${wordslimit}`
  } else if (name === "introduction") {
    let total = introductionInput.value.length;
    return introductionCount.innerHTML = `${total}/${wordslimit}`
  }
}






