const express               = require("express"),
app                         = express(),
mongoose                    = require("mongoose"),
bodyParser                  = require("body-parser"),
passport                    = require("passport"),
LocalStrategy               = require("passport-local"),
passportLocalMongoose       = require("passport-local-mongoose"),
User                        = require("./models/user");


mongoose.connect("mongodb://localhost/auth_demo_app");

app.use(require("express-session")({
    secret: "wow this is really secret",
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==============================
//ROUTES
//==============================


//Auth routes
//show sign up form 
app.get("/register", function(req, res){
    res.render("register"); 
});
//handeling user sign up 
app.post("/register", function(req, res){
    req.body.username;
    req.body.password;
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

app.get("/", function(req, res){
    res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
    res.render("secret");
});

//LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
    res.render("login");
});

//login logic
app.post("/login",passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function(req, res){
});
//log out
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

//route is listening 
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("server has started"); 
});