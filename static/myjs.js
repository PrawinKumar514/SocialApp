const API_BASE = 'http://127.0.0.1:8000/api';

let allPosts = [];

function formatDate(dateString){

    const date = new Date(dateString);

    return date.toLocaleString(
        "en-IN",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('registerBtn')
        .addEventListener('click', registerUser);

    document.getElementById('loginBtn')
        .addEventListener('click', loginUser);

    document.getElementById('createPostBtn')
        .addEventListener('click', createPost);

    document.getElementById('postImage')
    .addEventListener(
        'change',
        previewImage
    );

    document.getElementById('logout')
        .addEventListener('click', logoutUser);

    document.getElementById('editBioBtn')
        .addEventListener('click', editBio);

    document.getElementById('uploadPicBtn')
        .addEventListener('click', uploadProfilePicture);

    document.getElementById(
    'uploadCoverBtn'
).addEventListener(
    'click',
    uploadCoverPhoto
);

    document.getElementById('notificationBtn')
    .addEventListener('click', loadNotifications);

    document.getElementById('savedPostsBtn')
    .addEventListener(
        'click',
        loadSavedPosts
    );

    document.getElementById(
    'friendRequestsBtn'
).addEventListener(
    'click',
    loadFriendRequests
);

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
        loadNotificationCount();
        loadSavedPostsCount();
        loadFriendRequestCount();

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
        loadNotificationCount();
        loadSavedPostsCount();
        loadFriendRequestCount();

        alert('Login successful!');

    } else {

        alert(JSON.stringify(data));

    }
}

async function getSavedPostIds(){

    const response = await fetch(
        `${API_BASE}/saved-posts/?user_id=${
            localStorage.getItem('user_id')
        }`
    );

    const posts = await response.json();

    return posts.map(
        post => post.id
    );
}

async function loadFeed() {

    const response =
        await fetch(`${API_BASE}/posts/`);

    const posts =
        await response.json();

    allPosts = posts;

    const savedPostIds =
    await getSavedPostIds();

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
        onclick="viewUserProfile(${post.user.id})"
        style="
            text-decoration:none;
            color:inherit;
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
        onclick="openImage('${post.image}')"
        style="
            width:180px;
            height:180px;
            object-fit:cover;
            border-radius:10px;
            cursor:pointer;
        "
    >
` : ""}
                <small>${formatDate(post.created_at)}</small>

                <br><br>

                <button onclick="likePost(${post.id})">
                    ❤️ Like / Unlike
                </button>

                <button
    id="save-btn-${post.id}"
    onclick="savePost(${post.id})"
    style="
        margin-left:10px;
        background:${
            savedPostIds.includes(post.id)
            ? '#28a745'
            : '#1877f2'
        };
        color:white;
    "
>
    ${
        savedPostIds.includes(post.id)
        ? '✅ Saved'
        : '🔖 Save'
    }
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
    <div class="comment-box">
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

        if(!content.trim()){

    alert("Please enter some content");

    return;
}

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

    try{

    const response = await fetch(
        `${API_BASE}/posts/`,
        {
            method: 'POST',
            body: formData
        }
    );

    if(!response.ok){
        throw new Error();
    }

    const data = await response.json();

    document.getElementById(
        'postContent'
    ).value = '';

    document.getElementById(
        'postImage'
    ).value = '';

    document.getElementById(
        'imagePreview'
    ).src = '';

    document.getElementById(
        'imagePreview'
    ).style.display = 'none';

    const scrollPos = window.scrollY;

    await loadFeed();

    window.scrollTo(0, scrollPos);

}
catch(error){

    console.error(error);

    alert(
        "Failed to create post"
    );
}
    
    if (response.ok) {

    document.getElementById(
        'postContent'
    ).value = '';

    document.getElementById(
        'postImage'
    ).value = '';

    document.getElementById(
    'imagePreview'
).src = '';

document.getElementById(
    'imagePreview'
).style.display = 'none';

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

        if(!content.trim()){

    alert(
        "Comment cannot be empty"
    );

    return;
}

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

    if(
    userId ==
    localStorage.getItem('user_id')
){

    alert(
        "You cannot follow yourself"
    );

    return;
}

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

    if (
    bio === null ||
    !bio.trim()
){
    return;
}

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

async function searchPosts(){

    const keyword =
        document.getElementById(
            'searchUser'
        ).value
        .toLowerCase();

    if(keyword.trim() === ''){

        loadFeed();
        return;
    }

    const uniqueUsers = [];

    allPosts.forEach(post => {

        if(
            !uniqueUsers.find(
                user => user.id === post.user.id
            )
        ){

            uniqueUsers.push(post.user);
        }
    });

    const matchedUsers =
        uniqueUsers.filter(user =>
            user.username
                .toLowerCase()
                .includes(keyword)
        );

    const feed =
        document.getElementById('feed');

    feed.innerHTML = '';

    for(const user of matchedUsers){

        const profilePic =
            await getProfilePicture(user.id);

        feed.innerHTML += `

            <div
                style="
                    background:white;
                    padding:20px;
                    margin:10px;
                    border-radius:12px;
                    text-align:center;
                    box-shadow:0 2px 8px rgba(0,0,0,0.1);
                "
            >

                <img
                    src="${profilePic}"
                    style="
                        width:80px;
                        height:80px;
                        border-radius:50%;
                        object-fit:cover;
                        margin-bottom:10px;
                    "
                >

                <h3>
                    ${user.username}
                </h3>

                <p>
                    Followers:
                    ${user.followers_count}
                </p>

                <p>
                    Following:
                    ${user.following_count}
                </p>

                <button
                    onclick="viewUserProfile(${user.id})"
                >
                    View Profile
                </button>

                <button
                    onclick="followUser(${user.id})"
                    style="margin-left:10px;"
                >
                    Follow
                </button>

                <button
    onclick="sendFriendRequest(${user.id})"
>
    Add Friend
</button>

            </div>
        `;
    }

    if(matchedUsers.length === 0){

        feed.innerHTML = `
            <div
                style="
                    text-align:center;
                    padding:30px;
                "
            >
                No users found
            </div>
        `;
    }
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

async function uploadCoverPhoto() {

    const file =
        document.getElementById(
            'coverPhotoInput'
        ).files[0];

    if (!file) {

        alert(
            "Select a cover image first"
        );

        return;
    }

    const formData =
        new FormData();

    formData.append(
        'user_id',
        localStorage.getItem('user_id')
    );

    formData.append(
        'cover_photo',
        file
    );

    const response = await fetch(
        `${API_BASE}/profiles/`,
        {
            method: 'POST',
            body: formData
        }
    );

    const data =
        await response.json();

    if(response.ok){

        alert(
            "Cover photo uploaded"
        );

    }else{

        alert(
            JSON.stringify(data)
        );
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

        await fetch(
    `${API_BASE}/notifications/read/`,
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId
        })
    }
);

loadNotificationCount();

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

async function loadNotificationCount() {

    const userId =
        localStorage.getItem('user_id');

    if (!userId) return;

    const response = await fetch(
        `${API_BASE}/notifications/count/?user_id=${userId}`
    );

    const data =
        await response.json();

    document.getElementById(
        'notificationCount'
    ).innerText = data.count;
}

async function viewUserProfile(userId){

    const response =
        await fetch(`${API_BASE}/profile/${userId}/`);

    const user =
        await response.json();

    const postsResponse =
        await fetch(
            `${API_BASE}/user-posts/${userId}/`
        );

    const userPosts =
        await postsResponse.json();

    const modal =
        document.getElementById("userProfileModal");

    const content =
        document.getElementById("userProfileContent");

    content.innerHTML = `

<div
    style="
        position:relative;
        margin-bottom:80px;
    "
>

    <img
        src="${
            user.cover_photo
            ? 'http://127.0.0.1:8000' + user.cover_photo
            : 'https://via.placeholder.com/700x220'
        }"
        style="
            width:100%;
            height:220px;
            object-fit:cover;
            border-radius:12px;
        "
    >

    <img
        src="http://127.0.0.1:8000${user.profile_picture}"
        style="
            width:120px;
            height:120px;
            border-radius:50%;
            object-fit:cover;
            border:4px solid white;
            position:absolute;
            left:50%;
            bottom:-60px;
            transform:translateX(-50%);
            background:white;
        "
    >

</div>

<h2
    style="
        text-align:center;
        margin-top:-30px;
    "
>
    ${user.username}
</h2>

<hr>

<p><strong>Bio:</strong> ${user.bio}</p>

<p><strong>Followers:</strong> ${user.followers}</p>

<p><strong>Following:</strong> ${user.following}</p>

<p><strong>Posts:</strong> ${user.posts_count}</p>

<hr>

<h3>Recent Photos</h3>

<div
style="
display:flex;
flex-wrap:wrap;
gap:10px;
margin-bottom:15px;
">

${userPosts
    .filter(post => post.image)
    .map(post => `
        <img
            src="${post.image}"
            onclick="openImage('${post.image}')"
            style="
                width:120px;
                height:120px;
                object-fit:cover;
                border-radius:10px;
                cursor:pointer;
            "
        >
    `)
    .join('')
}

</div>

<hr>

<h3 style="margin-top:15px;">
    Recent Posts
</h3>

${
    userPosts
    .filter(post => post.content && post.content.trim() !== "")
    .map(post => `
        <div
            style="
                background:var(--post-bg, #f5f5f5);
                padding:10px;
                border-radius:8px;
                margin-bottom:10px;
            "
        >
            ${post.content}
        </div>
    `).join('')
    ||
    '<p>No posts yet</p>'
}

<br>

<button onclick="closeProfileModal()">
    Close
</button>

`;

    modal.style.display = "flex";
}

function closeProfileModal(){

    document.getElementById(
        "userProfileModal"
    ).style.display = "none";
}

function openImage(imageUrl){

    const modal = document.createElement("div");

    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.9)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "99999";

    modal.innerHTML = `
        <img
            src="${imageUrl}"
            style="
                max-width:90%;
                max-height:90%;
                border-radius:10px;
            "
        >
    `;

    modal.onclick = () => modal.remove();

    document.body.appendChild(modal);
}

function previewImage(){

    const file =
        document.getElementById(
            'postImage'
        ).files[0];

    const preview =
        document.getElementById(
            'imagePreview'
        );

    if(!file){

        preview.style.display = "none";
        return;
    }

    preview.src =
        URL.createObjectURL(file);

    preview.style.display =
        "block";
}

async function savePost(postId){

    const response = await fetch(
        `${API_BASE}/save-post/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: localStorage.getItem('user_id'),
                post_id: postId
            })
        }
    );

    const data = await response.json();

    const btn =
        document.getElementById(
            `save-btn-${postId}`
        );

    if(data.saved){

        btn.innerHTML = "✅ Saved";

        alert("Post saved");

    }else{

        btn.innerHTML = "🔖 Save";

        alert("Post removed from saved posts");
    }

    loadSavedPostsCount();
}

async function loadSavedPosts(){

    const response = await fetch(
        `${API_BASE}/saved-posts/?user_id=${
            localStorage.getItem('user_id')
        }`
    );

    const posts = await response.json();

    const modal =
        document.getElementById(
            'savedPostsModal'
        );

    const content =
        document.getElementById(
            'savedPostsContent'
        );

    content.innerHTML = `

        <h2 style="margin-bottom:10px;">
            🔖 Saved Posts
        </h2>

        <p style="color:gray;">
            Total Saved: ${posts.length}
        </p>

        <hr>

        ${
            posts.length
            ?
            posts.map(post => `

                <div
                    style="
                        background:${
                            document.body.classList.contains('dark-mode')
                            ? '#2a2a2a'
                            : '#f8f9fa'
                        };
                        padding:15px;
                        margin-bottom:15px;
                        border-radius:12px;
                        border:1px solid #ddd;
                    "
                >

                    <p
                        style="
                            color:gray;
                            font-size:13px;
                            margin-bottom:10px;
                        "
                    >
                        📅 ${
                            post.created_at
                            ? formatDate(post.created_at)
                            : ''
                        }
                    </p>

                    <p
                        style="
                            margin-bottom:10px;
                            line-height:1.5;
                        "
                    >
                        ${post.content || ''}
                    </p>

                    ${
                        post.image
                        ?
                        `
                        <img
                            src="${post.image}"
                            onclick="openImage('${post.image}')"
                            style="
                                width:100%;
                                max-width:400px;
                                border-radius:12px;
                                cursor:pointer;
                                display:block;
                                margin-bottom:10px;
                            "
                        >
                        `
                        :
                        ''
                    }

                </div>

            `).join('')
            :
            '<p>No saved posts yet</p>'
        }

        <br>

        <button
            onclick="
                document.getElementById(
                    'savedPostsModal'
                ).style.display='none'
            "
            style="
                background:#ff4d4f;
                color:white;
                border:none;
                padding:10px 20px;
                border-radius:8px;
                cursor:pointer;
            "
        >
            Close
        </button>

    `;

    modal.style.display = 'block';
}

async function loadSavedPostsCount(){

    const response = await fetch(
        `${API_BASE}/saved-posts/?user_id=${
            localStorage.getItem('user_id')
        }`
    );

    const posts = await response.json();

    document.getElementById(
        'savedPostsCount'
    ).innerText = posts.length;
}

// =========================
// DARK MODE
// =========================

const themeBtn =
document.getElementById(
    "themeToggleBtn"
);

if(localStorage.getItem("theme") === "dark"){

    document.body.classList.add(
        "dark-mode"
    );

    themeBtn.innerHTML = "☀️";
}

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark-mode"
        );

        if(
            document.body.classList.contains(
                "dark-mode"
            )
        ){

            localStorage.setItem(
                "theme",
                "dark"
            );

            themeBtn.innerHTML = "☀️";

        }else{

            localStorage.setItem(
                "theme",
                "light"
            );

            themeBtn.innerHTML = "🌙";
        }
    }
);

async function sendFriendRequest(receiverId){

    if(
    receiverId ==
    localStorage.getItem('user_id')
){

    alert(
        "You cannot send a friend request to yourself"
    );

    return;
}

    const response = await fetch(
        `${API_BASE}/send-friend-request/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                sender_id:
                    localStorage.getItem("user_id"),
                receiver_id: receiverId
            })
        }
    );

    const data = await response.json();

    alert(data.message);
}

async function loadFriendRequests(){

    const response = await fetch(
        `${API_BASE}/pending-friend-requests/?user_id=${
            localStorage.getItem('user_id')
        }`
    );

    const requests = await response.json();

    const list = document.getElementById(
        'friendRequestsList'
    );

    list.innerHTML = '';

    if(requests.length === 0){

        list.innerHTML = `
            <div style="
                padding:15px;
                text-align:center;
                color:#666;
            ">
                No friend requests
            </div>
        `;

    }else{

        requests.forEach(req => {

            list.innerHTML += `
                <div
    style="
        border:1px solid #ddd;
        padding:10px;
        margin-bottom:10px;
        border-radius:8px;
    "
>

    <div
    style="
        font-size:18px;
        font-weight:bold;
        margin-bottom:10px;
        color:red !important;
        background:yellow !important;
        display:block !important;
    "
>
    ${req.sender_username}
</div>

                    <button
                        onclick="acceptFriendRequest(${req.id})"
                        style="
                            background:#1877f2;
                            color:white;
                            border:none;
                            padding:8px 15px;
                            border-radius:6px;
                            cursor:pointer;
                        "
                    >
                        Accept
                    </button>

                </div>
            `;
        });
    }

    const dropdown =
        document.getElementById(
            'friendRequestsModal'
        );

    dropdown.style.display =
        dropdown.style.display === 'block'
            ? 'none'
            : 'block';
}

async function acceptFriendRequest(requestId){

    const response = await fetch(
        `${API_BASE}/accept-friend-request/`,
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                request_id: requestId
            })
        }
    );

    const data =
        await response.json();

    alert(data.message);
    loadFriendRequests();
    loadFriendRequestCount();
}

async function loadFriendRequestCount(){

    const response = await fetch(
        `${API_BASE}/pending-friend-requests/?user_id=${
            localStorage.getItem('user_id')
        }`
    );

    const requests =
        await response.json();

    document.getElementById(
        'friendRequestCount'
    ).textContent = requests.length;
}