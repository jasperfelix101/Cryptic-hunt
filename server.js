const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Create an Express app
const app = express();
const port = 3000;

// Serve static files (HTML, CSS, JS) from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON data in requests
app.use(bodyParser.json());

// Example in-memory database to store users' progress
const users = {};
const answers = ["echo", "shadow", "map"]; // Correct answers for levels
const questions = [
    "Level 1: Solve this first riddle: I speak without a mouth and hear without ears. What am I?",
    "Level 2: I follow you everywhere but am invisible. What am I?",
    "Level 3: I have cities, but no houses. I have mountains, but no trees. What am I?"
];

// API to validate the user's answer
app.post('/submit-answer', (req, res) => {
    const { username, answer } = req.body;

    // Create a user if not exists
    if (!users[username]) {
        users[username] = { level: 0 };
    }

    const currentLevel = users[username].level;

    // Check if the answer is correct
    if (answer.toLowerCase() === answers[currentLevel]) {
        users[username].level++;  // Move to next level
        if (users[username].level < questions.length) {
            res.json({
                correct: true,
                message: "Correct answer!",
                nextQuestion: questions[users[username].level]
            });
        } else {
            res.json({
                correct: true,
                message: "Congratulations! You've completed the cryptic hunt!"
            });
        }
    } else {
        res.json({
            correct: false,
            message: "Wrong answer! Try again."
        });
    }
});

// API to check the highest level players
app.get('/leaderboard', (req, res) => {
    const leaderboard = Object.keys(users)
        .map(username => ({ username, level: users[username].level }))
        .sort((a, b) => b.level - a.level);
    
    res.json(leaderboard);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// API to get the current level's question
app.post('/get-level', (req, res) => {
    const { username } = req.body;

    // If user doesn't exist, start at level 0
    if (!users[username]) {
        users[username] = { level: 0 };
    }

    const currentLevel = users[username].level;

    res.json({
        question: questions[currentLevel]
    });
});
