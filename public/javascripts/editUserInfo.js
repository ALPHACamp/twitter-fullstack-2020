const setBTN = document.querySelector('.set-info')

if (setBTN) {
  setBTN.addEventListener('click', event => {
    const id = event.target.dataset.id
    axios.get(`https://alphitter-turagon.herokuapp.com/api/users/${id}`)
    .then(response => {
      if (response.data.status && response.data.status === 'error') {
        return location.reload(true)
      }

      if (response.data.name) {
        return location.assign(`/users/${id}/editInfo`)
      }
    })

  })
}