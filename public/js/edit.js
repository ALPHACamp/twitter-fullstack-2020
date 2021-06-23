const editBackgorund = document.getElementById("edit-background");
const editAvatar = document.getElementById("edit-avatar");
const editBackgorundInput = document.getElementById("edit-background-input");
const editAvatarInput = document.getElementById("edit-avatar-input");
const editBackgroundImg = document.getElementById("edit-background-img");
const editAvatarImg = document.getElementById("edit-avatar-img"); 

function editImg(e){
    if(e.target.id === "edit-background"){
        editBackgorundInput.click();
    }else{
        editAvatarInput.click();
    }
}

function readImgSrc(input){
    let reader = new FileReader();
    reader.onload = function (e){
        if(input.target.id === "edit-background-input"){
            editBackgroundImg.setAttribute("src", e.target.result);
        }else{
            editAvatarImg.setAttribute("src", e.target.result);
        }
    }
    reader.readAsDataURL(input.target.files[0]);
}

editBackgorund.addEventListener("click", editImg);
editAvatar.addEventListener("click", editImg);

editBackgorundInput.addEventListener("change", readImgSrc);
editAvatarInput.addEventListener("change", readImgSrc);