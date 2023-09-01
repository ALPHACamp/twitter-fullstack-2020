function dynamicDisplay (event, num) {
  const target = event.target
  const displayBlock = target.parentElement.children[2]
  displayBlock.innerText = `${target.value.length}/${num}`
}
