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
});
