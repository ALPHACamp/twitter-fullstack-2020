const inputs = ['name', 'content', 'comment']

inputs.forEach(inputField => {
  const inputGroup = document.getElementsByName(inputField)
  if (inputGroup) {
    inputGroup.forEach(input => {
      input.addEventListener('keyup', characterCount)
    })
  }
})

function characterCount() {
  const displayer = document.querySelector(`.${this.id}WordCount`)
  let wordLimit = 0
  if (this.id === 'name') {
    wordLimit = 50

    if (document.querySelector(`.${this.id}CurrentCount`)) {
      document.querySelector(`.${this.id}CurrentCount`).innerText = this.value.length
    } else {
      const newItem = document.createElement('span')
      newItem.innerHTML = `<span class="${this.id}CurrentCount" max="${wordLimit}">${this.value.length}</span><span>/${wordLimit}</   span>`
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
  } else if (this.id === 'content') {
    wordLimit = 140
    if (this.value.length === wordLimit && !document.querySelector(`.${this.id}LengthWarning`)) {
      const wordLengthLimit = document.createElement('span')
      wordLengthLimit.innerHTML = `<span class="${this.id}LengthWarning">字數不可超過 140 字</span>`
      displayer.appendChild(wordLengthLimit)
    } else if (this.value.length < wordLimit && document.querySelector(`.${this.id}LengthWarning`)) {
      document.querySelector(`.${this.id}LengthWarning`).remove()
    }
  } else if (this.name === 'comment') {
    wordLimit = 140
    if (this.value.length === 0 && !document.querySelector(`.${this.id}EmptyWarning`)) {
      const emptyWarning = document.createElement('span')
      emptyWarning.innerHTML = `<span class="${this.id}EmptyWarning">內容不可空白</span>`
      displayer.appendChild(emptyWarning)
    } else if (this.value.length > 0 && document.querySelector(`.${this.id}EmptyWarning`)) {
      document.querySelector(`.${this.id}EmptyWarning`).remove()
    }
    if (this.value.length === wordLimit && !document.querySelector(`.${this.id}LengthWarning`)) {
      const wordLengthLimit = document.createElement('span')
      wordLengthLimit.innerHTML = `<span class="${this.id}LengthWarning">字數不可超過 140 字</span>`
      displayer.appendChild(wordLengthLimit)
    } else if (this.value.length < wordLimit && document.querySelector(`.${this.id}LengthWarning`)) {
      document.querySelector(`.${this.id}LengthWarning`).remove()
    }
  }
}
