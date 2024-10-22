// Check if the user has already entered their username
window.onload = function() {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        document.getElementById("username").value = storedUsername;
        document.getElementById("welcome-message").innerText = `Welcome back, ${storedUsername}!`;
    }
};

// Save the username on form submit
document.getElementById("username-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent page reload
    const username = document.getElementById("username").value;
    localStorage.setItem('username', username);  // Store username in localStorage
    startLevel();
});

function startLevel() {
    const username = document.getElementById("username").value;
    // Fetch the first question for the user
    fetch("/get-level", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username })
    }).then(response => response.json()).then(data => {
        document.getElementById("question").innerText = data.question;
    });
}
