document.addEventListener('DOMContentLoaded', function () {
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
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
          window.location.href = '/html/index.html';
        } else {
          response.text().then(text => alert(text));
        }
      }).catch(error => console.error('Error:', error));
    });
  }

  // Fetch and display arrangements
  if (document.querySelector('main')) {
    fetch('/api/arrangements')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to fetch arrangements');
        }
      })
      .then(arrangements => {
        const container = document.querySelector('main');
        container.innerHTML = arrangements.map(arrangement => `
          <div class="arrangement">
            <h3>${arrangement.arrangement_name}</h3>
            <p>${arrangement.date}</p>
            <p>${arrangement.about}</p>
            <button onclick="location.href='html/${arrangement.arrangement_name.toLowerCase().replace(/\s+/g, '-')}.html'">Les Mer</button>
            <span>❤️</span>
          </div>
        `).join('');
      })
      .catch(error => {
        console.error('Error fetching arrangements:', error);
        alert('Error loading arrangements.');
      });
  }
});
