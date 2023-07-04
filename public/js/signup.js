const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value;
  
    if (username && password) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      response.ok ? document.location.replace('/') : alert(response.statusText);
    }
  };
  
  document.querySelector('#signup-form').addEventListener('submit', signupFormHandler);
  