const remove = document.querySelector('#removeCover')
let coverImg = document.querySelector('#coverImg')
remove.addEventListener('click', (event) => {
  const bg = 'https://i.imgur.com/MrQpqrv.jpg'
  coverImg.src = "https://i.imgur.com/MrQpqrv.jpg"
  console.log(coverImg)
  readCoverURL(bg)
})

$("#cover").change(function () {
  readCoverURL(this);
});
function readCoverURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#cover_img").attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  } else if (input === 'https://i.imgur.com/MrQpqrv.jpg') {
    $("#cover_img").attr('src', input)
  }
}

$("#avatar").change(function () {
  readAvatarURL(this);
});
function readAvatarURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#avatar_img").attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}

