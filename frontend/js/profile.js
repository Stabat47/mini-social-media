const API = 'http://localhost:5000/api';
const token = localStorage.getItem('token');

// DOM elements
const profileHeader = document.getElementById('profileHeader');
const profilePosts = document.getElementById('profilePosts');
const logoutBtn = document.getElementById('logoutBtn');

// If not logged in → redirect to login
if (!token) {
  window.location.href = 'login.html';
}

// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});


// Back to feed
const backToFeedBtn = document.getElementById('backToFeedBtn');
if (backToFeedBtn) {
  backToFeedBtn.addEventListener('click', () => {
    window.location.href = 'feed.html';
  });
}


// Get ID of the profile being viewed
const params = new URLSearchParams(window.location.search);
const userId = params.get('userId');

let currentUser = null;

// ----------------------
// Fetch currently logged-in user
async function loadCurrentUser() {
  try {
    const res = await fetch(`${API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Cannot fetch current user');
    currentUser = await res.json();
  } catch (err) {
    console.error(err);
    alert('Could not load current user');
  }
}

// ----------------------
// Load the profile’s posts
async function loadProfilePosts() {
  try {
    const res = await fetch(`${API}/posts/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Cannot fetch user posts');
    const posts = await res.json();

    // Header
    if (posts.length > 0) {
      profileHeader.innerHTML = `<h2>${posts[0].user.username}'s Profile</h2>`;
    } else {
      profileHeader.innerHTML = `<h2>User's Profile</h2>`;
    }

    renderPosts(posts);
  } catch (err) {
    console.error(err);
    alert('Error loading profile posts');
  }
}

// ----------------------
// Add Follow / Unfollow button
function setupFollowBtn() {
  if (!currentUser || currentUser._id === userId) return; // don't follow self

  const followBtn = document.createElement('button');
  const isFollowing = currentUser.following?.some(f => f._id === userId);
  followBtn.textContent = isFollowing ? 'Unfollow' : 'Follow';

  followBtn.addEventListener('click', async () => {
    const action = followBtn.textContent === 'Follow' ? 'follow' : 'unfollow';
    try {
      await fetch(`${API}/users/${action}/${userId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      followBtn.textContent = action === 'follow' ? 'Unfollow' : 'Follow';
    } catch (err) {
      console.error(err);
      alert('Follow action failed');
    }
  });

  profileHeader.appendChild(followBtn);
}

// ----------------------
// Render all posts
function renderPosts(posts) {
  profilePosts.innerHTML = '';

  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.innerHTML = `
      <div class="post-header">
        <div class="avatar">
          <img src="${post.user.avatar || 'images/default-avatar.png'}" 
               alt="${post.user.username}">
        </div>
        <strong>${post.user.username}</strong>
      </div>

      <div class="post-content">${post.content}</div>
      ${post.image ? `<img src="${post.image}" class="post-image">` : ''}
    `;
    profilePosts.appendChild(postDiv);
  });
}

// ----------------------
// Run everything
(async () => {
  await loadCurrentUser();      // who is logged-in
  await loadProfilePosts();     // posts of profile being viewed
  setupFollowBtn();             // add follow/unfollow
})();
