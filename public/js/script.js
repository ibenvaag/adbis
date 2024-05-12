document.addEventListener('DOMContentLoaded', function () {
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();  // Prevents standard form submission
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;

      fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
      }).then(response => {
          if (response.ok) {
              window.location.href = '/html/index.html';  // Correct path
          } else {
              response.text().then(text => alert(text));  // Show server error message
          }
      }).catch(error => console.error('Error:', error));
    });
  } else {
    console.error("LoginForm not found!");
  }
});
