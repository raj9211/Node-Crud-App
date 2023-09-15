const ConnectToDatabase = require("./utils/db");
const User = require("./models/users");
const express = require('express');
const http = require('http');
const bodyParser = require("body-parser");
const app = express();
const port = 5000;


require('dotenv').config();
const cors = require("cors");


ConnectToDatabase();
// Middlewares
app.use(
    cors({
        origin: "*",
        methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
        preflightContinue: true,
    })
);

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));


const userRoutes = require("./routes/users");

//User route
app.use("/users", userRoutes);


//Home route
app.get("/", function (req, res) {
    res.render("home")
});

app.get("/register", function (req, res) {
    res.render("register")
});

app.get("/login", function (req, res) {
    res.render("login")
});

app.get("/about", function (req, res) {
    res.render("about", { aboutContent: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque" });
});

app.get("/contact", function (req, res) {
    res.render("contact", { contactContent: "Scelerisque eleifend donec pretium vulputate sapien" });
});

app.get("/users", async (req, res) => {
    const userData = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
    // console.log("data", userData);
    res.render('users', {
        users: userData
    });
});


const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
})

module.exports = app;