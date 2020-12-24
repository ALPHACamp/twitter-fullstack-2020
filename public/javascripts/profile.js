const nameCount = document.querySelector('.nameCount')
const nameInput = document.querySelector('.nameInput')

const descriptionInput = document.querySelector('.descriptionInput')
const descriptionCount = document.querySelector('.descriptionCount')


function countWords(name, wordslimit) {
  if (name === "name") {
    let total = nameInput.value.length;
    return nameCount.innerHTML = `${total}/${wordslimit}`
  } else if (name === "introduction") {
    let total = descriptionInput.value.length;
    return descriptionCount.innerHTML = `${total}/${wordslimit}`
  }
}






