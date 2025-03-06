const express = require("express");
const path = require("path");
const session = require("express-session");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ **Session Middleware**
app.use(session({
    secret: process.env.SESSION_SECRET || "your_secret_key", // ⚠️ Change this in production!
    resave: false,
    saveUninitialized: false
}));

// ✅ **Middleware**
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ **Static Files (CSS, JS, Images)**
app.use(express.static(path.join(__dirname, "public")));

// ✅ **Set View Engine**
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ **Authentication Middleware**
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/auth"); // If not logged in, go to login/signup page
}

// ✅ **Routes**
const authRoutes = require("./routes/authRoutes");
const workoutRoutes = require("./routes/workoutRoutes"); // 🏋️‍♂️ Add Workout Routes
const dietRoutes = require("./routes/dietRoutes"); // 🥗 Add Diet Routes

app.use("/auth", authRoutes);
app.use("/workouts", isAuthenticated, workoutRoutes); // ✅ Ensure protected access
app.use("/diet", isAuthenticated, dietRoutes); // ✅ Ensure protected access

// ✅ **Protected Home Route**
app.get("/", isAuthenticated, (req, res) => {
    res.render("home", { username: req.session.user.username });
});

// ✅ **Logout Route**
app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth");
    });
});

// ✅ **404 Error Handler**
app.use((req, res) => {
    res.status(404).render("error", { message: "⚠️ Error: Page Not Found!" });
});

// ✅ **Start Server**
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
