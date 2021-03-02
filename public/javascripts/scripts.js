$(() => {
  // Toast message for non-registration/login
  if (window.location.pathname !== '/login' && window.location.pathname !== '/regist') {
    // If there is any success / error message
    if (document.getElementById('snackbarMsg').innerHTML.replace(/\s/g, '') !== '') {
      const msgDiv = document.getElementById('snackbarMsg');
      msgDiv.classList.add('show');
      setTimeout(() => { msgDiv.classList.remove('show'); }, 3000);
    }
  }

  // Tweets Textarea Counter
  document.querySelectorAll('textarea[name=description]').forEach(() => {
    this.addEventListener('input', (event) => {
      const maxLength = event.target.getAttribute('maxlength');
      const currentLength = event.target.value.length;
      if (currentLength > maxLength) {
        event.target.nextElementSibling.querySelector('.btn').setAttribute('disabled', '');
      } else {
        event.target.nextElementSibling.querySelector('.btn').removeAttribute('disabled');
      }
      event.target.nextElementSibling.querySelector('.text-counter').innerHTML = `${currentLength} / ${maxLength}`;
    });
  });
});
