// Set nav item active
if (window.location.pathname === '/') {
  document.querySelector('.nav-link[href="/"]').parentElement.classList.add('active');
} else if (window.location.pathname.endsWith('setting')) {
  document.querySelector('.nav-link[href$="setting"]').parentElement.classList.add('active');
} else if (window.location.pathname.startsWith('/user/self/')) {
  document.querySelector('.navbar .nav-link[href$="/user/self"]').parentElement.classList.add('active');
  document.querySelector(`.nav-link[href$="${window.location.pathname}"]`).parentElement.classList.add('active');
} else if (document.querySelector(`.nav-link[href*="${window.location.pathname}"]`) !== null) {
  // Default to match nav items
  document.querySelector(`.nav-link[href*="${window.location.pathname}"]`).parentElement.classList.add('active');
}

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
document.querySelectorAll('textarea[name=description]').forEach((textarea) => {
  textarea.addEventListener('input', (event) => {
    const maxLength = 140;
    const currentLength = event.target.value.length;
    if (currentLength > maxLength) {
      event.target.nextElementSibling.querySelector('.btn').setAttribute('disabled', '');
    } else {
      event.target.nextElementSibling.querySelector('.btn').removeAttribute('disabled');
    }
    event.target.nextElementSibling.querySelector('.text-counter').innerHTML = `${currentLength} / ${maxLength}`;
  });
});

// Self Edit Name Counter
document.querySelectorAll('textarea[name=name]').forEach((textarea) => {
  textarea.addEventListener('input', (event) => {
    const maxLength = 50;
    const currentLength = event.target.value.length;
    if (currentLength > maxLength) {
      document.querySelector('.save-btn').setAttribute('disabled', '');
    } else {
      document.querySelector('.save-btn').removeAttribute('disabled');
    }
    event.target.nextElementSibling.querySelector('.text-counter').innerHTML = `${currentLength} / ${maxLength}`;
  });
});

document.querySelectorAll('textarea[name=introduction]').forEach((textarea) => {
  textarea.addEventListener('input', (event) => {
    const maxLength = 160;
    const currentLength = event.target.value.length;
    if (currentLength > maxLength) {
      document.querySelector('.save-btn').setAttribute('disabled', '');
    } else {
      document.querySelector('.save-btn').removeAttribute('disabled');
    }
    event.target.nextElementSibling.querySelector('.text-counter').innerHTML = `${currentLength} / ${maxLength}`;
  });
});
