document.addEventListener('DOMContentLoaded', function () {
  var loginForm = document.getElementById('loginForm');
  if (loginForm) {
    handleLoginForm(loginForm);
  }

  // Legger til event listener på knappen kun hvis den er tilstede på siden
  const registerButton = document.getElementById('registerButton');
  if (registerButton) {
    registerButton.addEventListener('click', function() {
      registerForEvent();
    });
  }

  // Håndterer kun spesifikke detaljer for CV-Kurs på cv-kurs.html
  if (document.body.id === "cv-kurs-page") {
    fetchArrangementDetails(1); // 1 er hardkodet id for CV-Kurs
  }

  // Håndterer visning av arrangementer på en generell side
  var mainContainer = document.querySelector('main');
  if (mainContainer && document.body.id !== "cv-kurs-page") {
    displayAllArrangements(mainContainer);
  }
});

function handleLoginForm(formElement) {
  formElement.addEventListener('submit', function (event) {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
    }).then(response => response.json())
    .then(data => {
      if (data.user_id) {
        localStorage.setItem('user_id', data.user_id); // Lagrer user_id i localStorage
        window.location.href = '/html/index.html'; // Navigerer til index.html
      } else {
        alert(data.message);
      }
    }).catch(error => console.error('Error:', error));
  });
}

function displayAllArrangements(container) {
  fetch('/api/arrangements')
    .then(response => response.json())
    .then(arrangements => {
      container.innerHTML = arrangements.map(arrangement => `
        <div class="arrangement">
          <h3>${arrangement.arrangement_name}</h3>
          <p>${arrangement.date}</p>
          <p>${arrangement.about}</p>
          <button onclick="window.location.href='cv-kurs.html'">Les Mer om CV-Kurs</button>
          <span>❤️</span>
        </div>
      `).join('');
    })
    .catch(error => {
      console.error('Error fetching arrangements:', error);
      alert('Error loading arrangements.');
    });
}

function fetchArrangementDetails(eventId) {
  fetch(`/api/arrangements/${eventId}`)
  .then(response => response.json())
  .then(arrangement => {
    updateArrangementDetails(arrangement);
  })
  .catch(error => {
    console.error('Failed to load arrangement details:', error);
    alert('Failed to load arrangement details');
  });
}

function updateArrangementDetails(arrangement) {
  const eventNameElement = document.getElementById('event-name');
  if (eventNameElement) {
    eventNameElement.textContent = arrangement.arrangement_name;
    document.getElementById('event-date').textContent = arrangement.date;
    document.getElementById('event-place').textContent = `Place: ${arrangement.location}`;
    document.getElementById('event-time').textContent = `Time: ${arrangement.date}`;
    document.getElementById('event-price').textContent = `Price: ${arrangement.price} kr`;
    document.getElementById('event-capacity').textContent = `Capacity: ${arrangement.capacity}`;
    document.getElementById('event-about').textContent = `About: ${arrangement.about}`;
  } else {
    console.error('Element not found: event-name');
  }
}

function registerForEvent() {
  const userId = localStorage.getItem('user_id'); // Anta at user_id er lagret i localStorage
  if (!userId) {
    alert("Du må være logget inn for å melde deg på.");
    return;
  }

  const ticketData = {
    user_id: userId,
    arrangement_id: 1, // Hardkodet for CV-Kurs
    date_of_purchase: new Date().toISOString().slice(0, 10) // YYYY-MM-DD format
  };

  fetch('/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticketData)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to register for the event');
    } return response.json();
  })
  .then(ticket => {
    console.log('Ticket created:', ticket);
    alert('Du er nå påmeldt kurset!');
  })
  .catch(error => {
    console.error('Error registering for the event:', error);
    alert('Failed to register for the event');
  });
}
   
