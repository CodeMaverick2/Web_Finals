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
    
    // Disable post button if count > 200
    postButton.disabled = count > 200 || count === 0;
}

// Create a new post
function createPost() {
    const content = textarea.value.trim();
    if (content && content.length <= 200) {
        const post = createPostElement(content);
        feedContainer.prepend(post);
        textarea.value = '';
        updateCharCount();
    }
}

// Create post HTML element
function createPostElement(content) {
    const post = document.createElement('div');
    post.className = 'ticket';
    post.innerHTML = `
        <div class="profile">
            <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/031/original/profile_image.png?1706888739">
        </div>
        <div class="post-sec">
            <div class="nav">
                User Name <span class="grey-text">@username</span>
                <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/028/original/edit.png?1706888661" class="edit-btn">
                <img src="https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/064/027/original/delete.png?1706888643" class="delete-btn">
            </div>
            <div class="text">${content}</div>
            <div class="like-comment">
                <button class="comment-btn">Comment</button>
                <button class="like-btn">Like <span class="like-count">0</span></button>
            </div>
            <div class="comments-section" style="display: none;">
                <textarea class="comment-input" placeholder="Write a comment..."></textarea>
                <button class="submit-comment">Submit</button>
                <div class="comments-list"></div>
            </div>
        </div>
    `;

    // Add event listeners for edit, delete, like, and comment
    post.querySelector('.edit-btn').addEventListener('click', () => editPost(post));
    post.querySelector('.delete-btn').addEventListener('click', () => deletePost(post));
    post.querySelector('.like-btn').addEventListener('click', () => likePost(post));
    post.querySelector('.comment-btn').addEventListener('click', () => toggleCommentSection(post));
    post.querySelector('.submit-comment').addEventListener('click', () => addComment(post));

    return post;
}

// Edit post
function editPost(post) {
    const textElement = post.querySelector('.text');
    const currentContent = textElement.textContent;
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
            textElement.textContent = newContent;
        }
        input.replaceWith(textElement);
    });
}

// Delete post
function deletePost(post) {
    if (confirm('Are you sure you want to delete this post?')) {
        post.remove();
    }
}

// Like post
function likePost(post) {
    const likeBtn = post.querySelector('.like-btn');
    const likeCount = likeBtn.querySelector('.like-count');
    let count = parseInt(likeCount.textContent);
    count++;
    likeCount.textContent = count;
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
        commentElement.textContent = commentText;
        commentsList.appendChild(commentElement);
        commentInput.value = '';
    }
}