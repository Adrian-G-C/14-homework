const addPostHandler = async (event) => {
    event.preventDefault();

    const title = document.querySelector('#post-title').value.trim();
    const text = document.querySelector('textarea[name="post-text"]').value.trim();

    const requestOptions = {
        method: 'POST',
        body: JSON.stringify({ title, text }),
        headers: { 'Content-Type': 'application/json' }
    };

    try {
        const response = await fetch('/api/posts', requestOptions);

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

document.querySelector('.add-post').addEventListener('submit', addPostHandler);
