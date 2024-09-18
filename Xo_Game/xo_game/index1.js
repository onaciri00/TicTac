// index.js
document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = '<h1>Hello from JavaScript!</h1><p>This content is injected by JavaScript.</p>';
    const newElement = document.createElement('p');
    newElement.textContent = 'This is a new paragraph added by JavaScript.';

    // Append the new element to the content div
    contentDiv.appendChild(newElement);
});
