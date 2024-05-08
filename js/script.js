
  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Send en POST-forespørsel til serveren med fetch API
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // Konverter dataene til en streng med URL-kodet form
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        // Login successful - redirect eller gjør noe
        window.location.href = '/home.html'; // Endre til din velkommen side
      } else {
        // Login failed - vis feilmelding
        alert('Login failed: ' + data.error);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });

