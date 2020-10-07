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