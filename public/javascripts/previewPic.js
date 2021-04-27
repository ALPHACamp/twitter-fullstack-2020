const coverImg = document.querySelector('#coverImg')
const avatarImg = document.querySelector('#avatarImg')
const removeCover = document.querySelector('#removeCover')

function readURL(input) {
  const reader = new FileReader();
  reader.onload = function (e) {
    if (input.id === 'cover') {
      coverImg.style = `background:url(${e.target.result});background-position:center;background-size:cover;`
    } else if (input.id === 'avatar') {
      avatarImg.style = `background: url(${e.target.result}),#C4C4C4; background-position:center;background-size:cover;`
    }
  }
  reader.readAsDataURL(input.files[0]);
}

removeCover.addEventListener('click', (e) => {
  coverImg.style = `background:url(''); background-color: #f5f8fa;`
})