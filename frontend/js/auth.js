document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://mini-social-media-jba5.onrender.com/api/auth';

    // Register
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    alert('Registration successful! Redirecting to feed...');
                    window.location.href = 'feed.html';
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (err) {
                alert('Error connecting to server');
                console.error(err);
            }
        });
    }

    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();
                if (res.ok) {
    localStorage.setItem('token', data.token);
    // Save user info for feed.js to know current user
    localStorage.setItem('user', JSON.stringify(data.user));
    alert('Login successful! Redirecting to feed...');
    window.location.href = 'feed.html';
    }
        else {
                    alert(data.message || 'Login failed');
                }
            } catch (err) {
                alert('Error connecting to server');
                console.error(err);
            }
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    }
});
