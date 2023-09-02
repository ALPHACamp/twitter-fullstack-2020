const alertElement = document.getElementById('alert')
    if (alertElement.style.display !== 'none') {
      setTimeout(() => {
        alertElement.style.display = 'none'
      }, 3000)
    }