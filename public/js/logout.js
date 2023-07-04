const logoutButtonHandler = async () => {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        document.location.replace('/login');
      } else {
        alert(response.statusText);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  
  document.querySelector('#logout').addEventListener('click', logoutButtonHandler);
  