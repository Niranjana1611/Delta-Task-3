const express = require("express");
const session = require('express-session');
const path = require("path");
const pageRouter = require("./routes/pages");
const bodyParser = require('body-parser') ;

const app = express();

app. use( bodyParser. urlencoded({ extended: true }) );

app.use(express.static(path.join(__dirname,"public")));

app.set("view engine", "ejs");

app.use(session({
    secret:'you-are-invited',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 1000 * 30
    }
}));

app.use("/", pageRouter);

app.use((req,res,next) => {
	var err = new Error("Page not found");
	err.status = 404;
	next(err);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.send(err.message);
});

app.listen(3333, () => {
	console.log("Server is running on port 3333...");
});

module.exports = app;