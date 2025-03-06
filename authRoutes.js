const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// ✅ Helper function to get users
function getUsers() {
    try {
        const data = fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

// ✅ Serve the Auth Page (GET /auth)
router.get("/", (req, res) => {
    res.render("auth", { error: null });
});

// ✅ Signup Route
router.post("/signup", (req, res) => {
    const { username, password } = req.body;
    let users = getUsers();

    if (users.some(u => u.username.trim().toLowerCase() === username.trim().toLowerCase())) {
        return res.render("auth", { error: "⚠️ Username already exists" });
    }

    const newUser = { username: username.trim(), password };
    users.push(newUser);
    fs.writeFileSync(path.join(__dirname, "../data/users.json"), JSON.stringify(users, null, 2));

    req.session.user = newUser; // ✅ Set session
    res.redirect("/"); // ✅ Redirect to home after signup
});

// ✅ Login Route
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    let users = getUsers();

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
        return res.render("auth", { error: "❌ Invalid username or password" });
    }

    req.session.user = user; // ✅ Set session
    res.redirect("/"); // ✅ Redirect to home after login
});

module.exports = router;
