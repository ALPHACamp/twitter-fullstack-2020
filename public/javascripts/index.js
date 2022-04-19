const name = document.querySelector('#name')

name.addEventListener('keyup', characterCount)

function characterCount() {
  const displayer = document.querySelector(`.${this.id}WordCount`)

  let wordLimit = 0
  if (this.id === 'name') {
    wordLimit = 50
  }

  if (document.querySelector(`.${this.id}CurrentCount`)) {
    document.querySelector(`.${this.id}CurrentCount`).innerText = this.value.length
  } else {
    const newItem = document.createElement('span')
    newItem.innerHTML = `
    <span class="${this.id}CurrentCount" max="${wordLimit}">${this.value.length}</span><span>/${wordLimit}</span>
  `
    displayer.appendChild(newItem)
  }
  if (this.value.length === wordLimit && !document.querySelector(`.${this.id}LengthWarning`)) {
    this.classList.add('border-danger')
    const wordLengthLimit = document.createElement('span')
    wordLengthLimit.innerHTML = `<span class="${this.id}LengthWarning">字數已達上限！</span>`
    displayer.appendChild(wordLengthLimit)
  } else if (this.value.length < wordLimit && document.querySelector(`.${this.id}LengthWarning`)) {
    this.classList.remove('border-danger')
    document.querySelector(`.${this.id}LengthWarning`).remove()
  }
}
