const token = localStorage.getItem('token');
const feedContainer = document.getElementById('feedContainer');
const postBtn = document.getElementById('postBtn');
const postContent = document.getElementById('postContent');
const logoutBtn = document.getElementById('logoutBtn');
const postImage = document.getElementById('postImage');
const videoBtn = document.getElementById('videoBtn');

const API = 'https://mini-social-media-jba5.onrender.com/api'; 

// Get current user info from localStorage
const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
const currentUserId = currentUser ? currentUser._id : null;

// Login check
const navAvatar = document.getElementById('navAvatar');
const navUsername = document.getElementById('navUsername');


// Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
});

// Create new post with optional image
postBtn.addEventListener('click', async () => {
  const content = postContent.value.trim();
  const file = postImage.files[0];

  if (!content && !file) return alert('Write something or attach an image.');

  const formData = new FormData();
  formData.append('content', content);
  if (file) formData.append('image', file);

  try {
    const res = await fetch(`${API}/posts`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.message);
      return;
    }

    postContent.value = '';
    postImage.value = '';
    loadFeed();
  } catch (err) {
    alert('Error creating post');
  }
});

// Placeholder for video
videoBtn.addEventListener('click', () => {
  alert('Video upload not implemented yet.');
});

// Fetch and render posts
async function loadFeed() {
  try {
    const res = await fetch(`${API}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const posts = await res.json();
    renderPosts(posts);
  } catch (err) {
    alert('Error loading feed');
  }
}

function renderPosts(posts) {
  feedContainer.innerHTML = '';

  posts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    // Post image if exists
    const imageHTML = post.image ? `<img src="${post.image}" alt="post image" class="post-image">` : '';

    // Edit/Delete buttons only for own posts
    const ownPostButtons = post.user._id === currentUserId ? `
      <button class="editBtn" data-id="${post._id}">✏️ Edit</button>
      <button class="deleteBtn" data-id="${post._id}">🗑️ Delete</button>
    ` : '';

    postDiv.innerHTML = `
      <div class="post-header">
        <a href="profile.html?userId=${post.user._id}">
          <div class="avatar">
            <img src="${post.user.avatar || 'images/default-avatar.png'}" alt="${post.user.username}">
          </div>
          <strong>${post.user.username}</strong>
        </a>
      </div>

      <div class="post-content">${post.content}</div>
      ${imageHTML}

      <div class="post-actions">
        <button class="likeBtn" data-id="${post._id}">❤️ ${post.likes.length}</button>
        <button class="commentToggle" data-id="${post._id}">💬 ${post.comments.length}</button>
        ${ownPostButtons}
      </div>

      <div class="comment-section" id="comments-${post._id}" style="display:none;">
        <div class="existing-comments">
          ${post.comments.map(c => `
            <div class="comment"><strong>${c.user.username}:</strong> ${c.content}</div>
          `).join('')}
        </div>
        <input type="text" placeholder="Add a comment..." class="commentInput" data-id="${post._id}" />
        <button class="commentBtn" data-id="${post._id}">Comment</button>
      </div>
    `;

    feedContainer.appendChild(postDiv);
  });

  addPostListeners();
}

function addPostListeners() {
  // Like buttons
  document.querySelectorAll('.likeBtn').forEach(btn => {
    btn.addEventListener('click', () => toggleLike(btn.dataset.id));
  });

  // Toggle comments
  document.querySelectorAll('.commentToggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const section = document.getElementById(`comments-${btn.dataset.id}`);
      section.style.display = section.style.display === 'none' ? 'block' : 'none';
    });
  });

  // Comment submit
  document.querySelectorAll('.commentBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.querySelector(`.commentInput[data-id="${btn.dataset.id}"]`);
      addComment(btn.dataset.id, input.value);
      input.value = '';
    });
  });

  // Edit post
  document.querySelectorAll('.editBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const postContentDiv = btn.closest('.post').querySelector('.post-content');
      const newContent = prompt('Edit your post:', postContentDiv.textContent);
      if (!newContent) return;
      await fetch(`${API}/posts/${btn.dataset.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: newContent })
      });
      loadFeed();
    });
  });

  // Delete post
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Delete this post?')) return;
      await fetch(`${API}/posts/${btn.dataset.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      loadFeed();
    });
  });
}

// Toggle like
async function toggleLike(postId) {
  try {
    await fetch(`${API}/posts/${postId}/like`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    loadFeed();
  } catch (err) {
    alert('Error liking post');
  }
}

// Add comment
async function addComment(postId, text) {
  if (!text.trim()) return;
  try {
    await fetch(`${API}/comments/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ text })
    });
    loadFeed();
  } catch (err) {
    alert('Error adding comment');
  }
}


// Get logged-in user info
async function loadCurrentUser() {
  try {
    const res = await fetch(`${API}/auth/user/${JSON.parse(atob(token.split('.')[1])).id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const user = await res.json();

    navUsername.textContent = user.username;
    navAvatar.src = user.avatar || 'images/default-avatar.png';
  } catch (err) {
    console.error('Failed to load user info', err);
  }
}

loadCurrentUser();

// Load feed on startup
loadFeed();
