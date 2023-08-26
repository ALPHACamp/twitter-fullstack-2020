const tweets = document.querySelector('.li-container')

function deleteTweet(event) {
  const target = event.target

  if ((target.matches('img'))) {
    event.preventDefault()

    swal({
      title: "確定刪除資料?",
      icon: "warning",
      text: "刪除的資料將無法恢復",
      buttons: true,
      dangerMode: true
    }).then(check => {
      if (check) {
        const id = target.dataset.id
        document.querySelector(`.form-${id}`).submit()
      }
    })
  }
}

tweets.addEventListener('click', (deleteTweet))