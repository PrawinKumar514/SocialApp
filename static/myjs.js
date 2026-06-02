const API_BASE = 'http://127.0.0.1:8000/api';

let allPosts = [];

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('registerBtn')
        .addEventListener('click', registerUser);

    document.getElementById('loginBtn')
        .addEventListener('click', loginUser);

    document.getElementById('createPostBtn')
        .addEventListener('click', createPost);

    document.getElementById('logout')
        .addEventListener('click', logoutUser);

    document.getElementById('editBioBtn')
        .addEventListener('click', editBio);

    document.getElementById('uploadPicBtn')
        .addEventListener('click', uploadProfilePicture);

    document.getElementById('notificationBtn')
    .addEventListener('click', loadNotifications);

    // AUTO LOGIN AFTER REFRESH

    if (localStorage.getItem('user_id')) {

        document.getElementById('authSection')
            .style.display = 'none';

        document.getElementById('mainContent')
            .style.display = 'grid';

        document.getElementById('username')
            .textContent =
            localStorage.getItem('username');

        document.getElementById('profileUsername')
            .textContent =
            localStorage.getItem('username');

        loadFeed();
        loadProfile();
        loadProfilePicture();

    }

});


async function registerUser() {

    const username =
        document.getElementById('authUsername').value;

    const password =
        document.getElementById('authPassword').value;

    const response = await fetch(
        `${API_BASE}/register/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const data = await response.json();

    if (response.ok) {
        alert('Registration Successful!');
    } else {
        alert(JSON.stringify(data));
    }
}


async function loginUser() {

    const username =
        document.getElementById('authUsername').value;

    const password =
        document.getElementById('authPassword').value;

    const response = await fetch(
        `${API_BASE}/login/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        }
    );

    const data = await response.json();

    if (response.ok) {

        localStorage.setItem(
            'username',
            data.username
        );

        localStorage.setItem(
            'user_id',
            data.user_id
        );

        document.getElementById('username')
    .textContent = data.username;

document.getElementById('profileUsername')
    .textContent = data.username;

document.getElementById('profileBio')
    .textContent =
    localStorage.getItem('bio') || 'No bio yet';

        document.getElementById('authSection')
            .style.display = 'none';

        document.getElementById('mainContent')
            .style.display = 'block';

        loadFeed();
        loadProfile();
        loadProfilePicture();

        alert('Login successful!');

    } else {

        alert(JSON.stringify(data));

    }
}

async function loadFeed() {

    const response =
        await fetch(`${API_BASE}/posts/`);

    const posts =
        await response.json();

    allPosts = posts;

    const feed =
        document.getElementById('feed');

    feed.innerHTML = '';

    const currentUserId =
        localStorage.getItem('user_id');

    const currentUserPost =
        posts.find(
            post =>
            post.user.id == currentUserId
        );

    if (currentUserPost) {

        document.getElementById('followersCount')
            .textContent =
            currentUserPost.user.followers_count;

        document.getElementById('followingCount')
            .textContent =
            currentUserPost.user.following_count;
    }

    document.getElementById('postCount')
        .textContent =
        posts.filter(
            post =>
            post.user.id ==
            currentUserId
        ).length;

    for (const post of posts) {

        const profilePic =
            await getProfilePicture(
                post.user.id
            );

        feed.innerHTML += `
            <div style="
                background:white;
                padding:15px;
                margin:10px;
                border-radius:8px;
            ">

                <div style="
                    display:flex;
                    align-items:center;
                    gap:10px;
                    margin-bottom:10px;
                ">

                    <img
                    src="${profilePic}"
                        style="
                            width:50px;
                            height:50px;
                            border-radius:50%;
                            object-fit:cover;
                        "
                    >

                    <div>

                    <h3 style="margin:0;">

    <a
        href="javascript:void(0)"
        onclick="viewProfile(${post.user.id})"
        style="
            text-decoration:none;
            color:black;
        "
    >
        ${post.user.username}
    </a>

</h3>

                        <button
                            onclick="followUser(${post.user.id})"
                            style="
                                margin-top:5px;
                                background:green;
                                color:white;
                            "
                        >
                            👥 Follow / Unfollow
                        </button>

                    </div>

                </div>

                <p>${post.content}</p>

                ${post.image ? `
                    <img
                        src="${post.image}"
                        style="
                            max-width:350px;
                            width:100%;
                            border-radius:10px;
                            margin-top:10px;
                            margin-bottom:10px;
                        "
                    >
                ` : ''}

                <small>${post.created_at}</small>

                <br><br>

                <button onclick="likePost(${post.id})">
                    ❤️ Like / Unlike
                </button>

                ${parseInt(localStorage.getItem('user_id')) === post.user.id ? `
                    <button
                        onclick="editPost(${post.id}, '${post.content}')"
                        style="
                            margin-left:10px;
                            background:orange;
                            color:white;
                        "
                    >
                        ✏️ Edit
                    </button>

                    <button
                        onclick="deletePost(${post.id})"
                        style="
                            margin-left:10px;
                            background:red;
                            color:white;
                        "
                    >
                        🗑️ Delete
                    </button>
                ` : ''}

                <span style="margin-left:10px;">
                    ${post.likes_count} Likes
                </span>

                <br><br>

                <input
                    type="text"
                    id="comment-${post.id}"
                    placeholder="Write a comment..."
                >

                <button onclick="addComment(${post.id})">
                    Comment
                </button>

                <br><br>

                <div id="comments-${post.id}">

                    <b>Comments</b>

                    <hr>

                    ${post.comments.map(comment => `
                        <div style="
                            margin-bottom:8px;
                            padding:5px;
                            background:#f5f5f5;
                        ">
                            <b>${comment.user.username}</b>:
                            ${comment.content}
                        </div>
                    `).join('')}

                </div>

            </div>
        `;
    }
}

async function createPost() {

    const content =
        document.getElementById('postContent').value;

    const image =
        document.getElementById('postImage').files[0];

    const formData =
        new FormData();

    formData.append(
        'content',
        content
    );

    formData.append(
        'user_id',
        localStorage.getItem('user_id')
    );

    if (image) {

        formData.append(
            'image',
            image
        );

    }

    const response = await fetch(
        `${API_BASE}/posts/`,
        {
            method: 'POST',
            body: formData
        }
    );

    const data = await response.json();
    
    if (response.ok) {

    document.getElementById(
        'postContent'
    ).value = '';

    document.getElementById(
        'postImage'
    ).value = '';

    const scrollPos = window.scrollY;

    await loadFeed();

    window.scrollTo(0, scrollPos);

}

else {

        alert(JSON.stringify(data));

    }
}


async function likePost(postId) {

    const response = await fetch(
        `${API_BASE}/likes/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post: postId,
                user_id: localStorage.getItem('user_id')
            })
        }
    );

    const data = await response.json();
    
    if (response.ok) {

    const scrollPos = window.scrollY;

    await loadFeed();

    window.scrollTo(0, scrollPos);

}
else {

        alert(JSON.stringify(data));

    }
}


async function addComment(postId) {

    const content =
        document.getElementById(`comment-${postId}`).value;

    const response = await fetch(
        `${API_BASE}/comments/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post: postId,
                content: content,
                user_id: localStorage.getItem('user_id')
            })
        }
    );

    const data = await response.json();
    
    if (response.ok) {

    const scrollPos = window.scrollY;

    await loadFeed();

    window.scrollTo(0, scrollPos);

}
else {

        alert(JSON.stringify(data));

    }
}


async function deletePost(postId) {

    if (!confirm("Delete this post?")) {
        return;
    }

    const response = await fetch(
        `${API_BASE}/posts/${postId}/`,
        {
            method: 'DELETE'
        }
    );
    
    if (response.ok) {

    const scrollPos = window.scrollY;

    await loadFeed();

    window.scrollTo(0, scrollPos);

}
else {

        alert("Failed to delete post");

    }
}


async function editPost(postId, oldContent) {

    const newContent = prompt(
        "Edit your post:",
        oldContent
    );

    if (!newContent) {
        return;
    }

    const response = await fetch(
        `${API_BASE}/posts/${postId}/`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: newContent
            })
        }
    );
    
    if (response.ok) {

    const scrollPos = window.scrollY;

    await loadFeed();

    window.scrollTo(0, scrollPos);

}

else {

        alert("Failed to update post");

    }
}


async function followUser(userId) {

    const response = await fetch(
        `${API_BASE}/follows/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                following: userId,
                user_id: localStorage.getItem('user_id')
            })
        }
    );

    const data = await response.json();

    alert(data.message);
}

function logoutUser() {

    localStorage.removeItem('username');
    localStorage.removeItem('user_id');

    document.getElementById('authSection')
        .style.display = 'block';

    document.getElementById('mainContent')
        .style.display = 'none';

    document.getElementById('username')
        .textContent = '';

    document.getElementById('profileUsername')
        .textContent = '';

    document.getElementById('profileBio')
        .textContent = 'No bio yet';

    document.getElementById('authUsername').value = '';
    document.getElementById('authPassword').value = '';

    alert('Logged out successfully');
}

async function editBio() {

    const bio = prompt(
        "Enter your bio:",
        document.getElementById("profileBio").innerText
    );

    if (bio === null) return;

    const formData = new FormData();

    formData.append(
        "user_id",
        localStorage.getItem("user_id")
    );

    formData.append(
        "bio",
        bio
    );

    const response = await fetch(
        `${API_BASE}/profiles/`,
        {
            method: "POST",
            body: formData
        }
    );

    const data = await response.json();

    if (response.ok) {

        document.getElementById(
            "profileBio"
        ).innerText = data.bio || bio;

        loadProfile();

    } else {

        alert("Failed to save bio");

    }
}

function searchPosts() {

    const keyword =
        document.getElementById('searchUser')
        .value
        .toLowerCase();

    const filteredPosts =
        allPosts.filter(post =>
            post.user.username
                .toLowerCase()
                .includes(keyword)
        );

    const feed =
        document.getElementById('feed');

    feed.innerHTML = '';

    filteredPosts.forEach(post => {

        feed.innerHTML += `
            <div style="
                background:white;
                padding:15px;
                margin:10px;
                border-radius:8px;
            ">
                <h3>${post.user.username}</h3>

                <p>${post.content}</p>

                <small>${post.created_at}</small>
            </div>
        `;
    });
}

async function uploadProfilePicture() {

    const file =
        document.getElementById('profilePicInput')
        .files[0];

    if (!file) {
        alert("Select an image first");
        return;
    }

    const formData = new FormData();

    formData.append(
        'user_id',
        localStorage.getItem('user_id')
    );

    formData.append(
        'profile_picture',
        file
    );

    const response = await fetch(
        `${API_BASE}/profiles/`,
        {
            method: 'POST',
            body: formData
        }
    );

    const data = await response.json();

    if (response.ok) {

        alert("Profile picture uploaded");

        if (data.profile_picture) {

    document.getElementById(
        'profileImage'
    ).src =
    data.profile_picture;
}

    } else {

        alert(JSON.stringify(data));

    }
}

async function loadProfilePicture() {

    const response =
        await fetch(`${API_BASE}/profiles/`);

    const profiles =
        await response.json();

    const currentUserId =
        localStorage.getItem('user_id');

    const profile =
        profiles.find(
            p => p.user == currentUserId
        );

    if (
        profile &&
        profile.profile_picture
    ) {

        document.getElementById(
            'profileImage'
        ).src =
        profile.profile_picture;
    }
}

async function loadProfile() {

    const response =
        await fetch(`${API_BASE}/profiles/`);

    const profiles =
        await response.json();

    const currentUserId =
        localStorage.getItem('user_id');

    const profile =
        profiles.find(
            p => p.user == currentUserId
        );

    if (profile) {

        document.getElementById(
            'profileBio'
        ).textContent =
            profile.bio || 'No bio yet';

    }
}

async function getProfilePicture(userId) {

    const response =
        await fetch(`${API_BASE}/profiles/`);

    const profiles =
        await response.json();

    const profile =
        profiles.find(
            p => p.user == userId
        );

    if (
        profile &&
        profile.profile_picture
    ) {
        return profile.profile_picture;
    }

    return '';
}

async function viewProfile(userId) {

    const postsResponse =
        await fetch(`${API_BASE}/posts/`);

    const posts =
        await postsResponse.json();

    const userPosts =
        posts.filter(
            post => post.user.id == userId
        );

    if (userPosts.length === 0) return;

    const user = userPosts[0].user;

    document.getElementById(
        'profileContent'
    ).innerHTML = `
        <h2>${user.username}</h2>

        <p>Followers: ${user.followers_count}</p>

        <p>Following: ${user.following_count}</p>

        <hr>

        <h3>Posts</h3>

        ${userPosts.map(post => `
            <div style="
                border:1px solid #ddd;
                padding:10px;
                margin-bottom:10px;
            ">
                <p>${post.content}</p>

                ${post.image ? `
                    <img
                        src="${post.image}"
                        style="
                            max-width:250px;
                            border-radius:10px;
                        "
                    >
                ` : ''}
            </div>
        `).join('')}
    `;

    document.getElementById(
        'profileModal'
    ).style.display = 'block';
}

function closeProfile() {

    document.getElementById(
        'profileModal'
    ).style.display = 'none';
}

async function loadNotifications() {

    const userId =
        localStorage.getItem('user_id');

    const response = await fetch(
        `${API_BASE}/notifications/?user_id=${userId}`
    );

    const notifications =
        await response.json();

    const container =
        document.getElementById(
            'notificationContainer'
        );

    const list =
        document.getElementById(
            'notificationList'
        );

    list.innerHTML = '';

    notifications.forEach(notification => {

        console.log(notification);

        const item = document.createElement("div");

item.style.padding = "12px 15px";
item.style.color = "#222";
item.style.borderBottom = "1px solid #ddd";

item.textContent = "🔔 " + notification.message;

list.appendChild(item);

    });

    container.style.display =
    container.style.display === 'block'
        ? 'none'
        : 'block';
}