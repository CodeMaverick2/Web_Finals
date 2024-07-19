// DOM elements
const textarea = document.getElementById('post-textarea');
const postButton = document.querySelector('.post-button');
const charCount = document.getElementById('char-count');
const feedContainer = document.querySelector('.ticket-containers');

// Event listeners
textarea.addEventListener('input', updateCharCount);
postButton.addEventListener('click', createPost);
textarea.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        createPost();
    }
});

// Character count update
function updateCharCount() {
    const count = textarea.value.length;
    charCount.textContent = count;
    
    // Disable post button if count > 200 or empty
    postButton.disabled = count > 200 || count === 0;
    
    // Change color based on character count
    if (count > 180) {
        charCount.style.color = 'red';
    } else if (count > 160) {
        charCount.style.color = 'orange';
    } else {
        charCount.style.color = 'inherit';
    }
}

// Create a new post
function createPost() {
    const content = textarea.value.trim();
    if (content && content.length <= 200) {
        const post = createPostElement(content);
        feedContainer.prepend(post);
        textarea.value = '';
        updateCharCount();
        savePosts(); // Save posts to local storage
    }
}

// Create post HTML element
function createPostElement(content) {
    const post = document.createElement('div');
    post.className = 'ticket';
    const timestamp = new Date().toLocaleString();
    post.innerHTML = `
        <div class="post-sec">
            <div class="nav">
                <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739" class="profile-img">
                <span>Tejas <span class="grey-text">@tejas</span></span>
                <span class="grey-text timestamp">${timestamp}</span>
                <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/028/original/edit.png?1706888661" class="edit-btn">
                <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/027/original/delete.png?1706888643" class="delete-btn">
            </div>
            <div class="text">${formatContent(content)}</div>
            <div class="like-comment">
                <button class="comment-btn">💬 <span class="comment-count">0</span></button>
                <button class="like-btn">🤍 <span class="like-count">0</span></button>
            </div>
            <div class="comments-section" style="display: none;">
                <div class="comment-box">
                    <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739" class="comment-profile-img">
                    <textarea class="comment-input" placeholder="Write a comment..."></textarea>
                </div>
                <button class="submit-comment">Comment</button>
                <div class="comments-list"></div>
            </div>
        </div>
    `;
    // Add event listeners for edit, delete, like, and comment
    post.querySelector('.edit-btn').addEventListener('click', () => editPost(post));
    post.querySelector('.delete-btn').addEventListener('click', () => deletePost(post));
    post.querySelector('.like-btn').addEventListener('click', (e) => likePost(e.currentTarget));
    post.querySelector('.comment-btn').addEventListener('click', () => toggleCommentSection(post));
    post.querySelector('.submit-comment').addEventListener('click', () => addComment(post));

    return post;
}

// Format content (add hashtag links and line breaks)
function formatContent(content) {
    return content
        .replace(/(#\w+)/g, '<a href="#" class="hashtag">$1</a>')
        .replace(/\n/g, '<br>');
}

// Edit post
function editPost(post) {
    const textElement = post.querySelector('.text');
    const currentContent = textElement.innerHTML.replace(/<br>/g, '\n');
    const input = document.createElement('textarea');
    input.value = currentContent;
    input.style.width = '100%';
    input.style.height = 'auto';
    input.style.minHeight = '100px';
    textElement.replaceWith(input);

    input.focus();

    input.addEventListener('blur', () => {
        const newContent = input.value.trim();
        if (newContent && newContent !== currentContent) {
            textElement.innerHTML = formatContent(newContent);
        }
        input.replaceWith(textElement);
        savePosts(); // Save posts after editing
    });
}

// Delete post
function deletePost(post) {
    if (confirm('Are you sure you want to delete this post?')) {
        post.remove();
        savePosts(); // Save posts after deletion
    }
}

// Like post
function likePost(likeBtn) {
    const likeCount = likeBtn.querySelector('.like-count');
    let count = parseInt(likeCount.textContent);
    
    if (likeBtn.textContent.includes('🤍')) {
        likeBtn.innerHTML = `❤️ <span class="like-count">${count + 1}</span>`;
    } else {
        likeBtn.innerHTML = `🤍 <span class="like-count">${count - 1}</span>`;
    }
    savePosts(); // Save posts after liking
}

// Toggle comment section
function toggleCommentSection(post) {
    const commentSection = post.querySelector('.comments-section');
    commentSection.style.display = commentSection.style.display === 'none' ? 'block' : 'none';
}

// Add comment
function addComment(post) {
    const commentInput = post.querySelector('.comment-input');
    const commentsList = post.querySelector('.comments-list');
    const commentText = commentInput.value.trim();
    
    if (commentText) {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739" class="comment-profile-img">
            <div class="comment-content">
                <span class="comment-username">Tejas</span>
                <p>${formatContent(commentText)}</p>
            </div>
        `;
        commentsList.appendChild(commentElement);
        commentInput.value = '';
        
        // Update comment count
        const commentBtn = post.querySelector('.comment-btn');
        const commentCount = commentBtn.querySelector('.comment-count');
        commentCount.textContent = parseInt(commentCount.textContent) + 1;
        
        savePosts(); // Save posts after adding comment
    }
}

// Save posts to local storage
function savePosts() {
    const posts = Array.from(feedContainer.children).map(post => ({
        content: post.querySelector('.text').innerHTML,
        likes: post.querySelector('.like-count').textContent,
        comments: Array.from(post.querySelectorAll('.comment')).map(comment => ({
            username: comment.querySelector('.comment-username').textContent,
            content: comment.querySelector('p').innerHTML
        })),
        timestamp: post.querySelector('.timestamp').textContent
    }));
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Load posts from local storage
function loadPosts() {
    const savedPosts = JSON.parse(localStorage.getItem('posts'));
    if (savedPosts) {
        savedPosts.forEach(postData => {
            const post = createPostElement(postData.content);
            post.querySelector('.text').innerHTML = postData.content;
            post.querySelector('.like-count').textContent = postData.likes;
            post.querySelector('.comment-count').textContent = postData.comments.length;
            post.querySelector('.timestamp').textContent = postData.timestamp;
            
            const commentsList = post.querySelector('.comments-list');
            postData.comments.forEach(commentData => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                commentElement.innerHTML = `
                    <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739" class="comment-profile-img">
                    <div class="comment-content">
                        <span class="comment-username">${commentData.username}</span>
                        <p>${commentData.content}</p>
                    </div>
                `;
                commentsList.appendChild(commentElement);
            });
            
            feedContainer.appendChild(post);
        });
    }
}

// Call loadPosts when the page loads
window.addEventListener('load', loadPosts);