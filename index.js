const express = require('express');
const cors = require('cors');
const session = require('express-session');

// App
const app = express();

// TLM
app.use(express.json());
app.use(cors());

// Session
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat yo',
    cookie: {maxAge: 60000}
}));

// Custom TLM
app.use('/api/users', (req, res, next) => {
    console.log('user route hit!');
    next();
});

// Dummy Data
let user = {
    username: 'tayte123',
    password: 'password123',
    full_name: 'Tayte Stokes',
    color: 'black'
};

// Custom Middleware Functions
const authenticateUser = (req, res, next) => {
    const {username, password} = req.body;
    if(username === user.username && password === user.password){
        req.session.user = user;
        next()
    } else {
        res.status(403).send('Invalid username or password');
    }
};

app.get('/api/users', (req, res) => {
    res.status(200).send('no users here sorry')
})

app.post('/api/login', authenticateUser, (req, res) => {
    console.log(req.session)
    // send back user object
    res.status(200).send(user);
});

app.get('/api/logout', (req, res) => {
    // Destory a session
    req.session.destroy();
    res.send('user logged out')
})

// App Listening
app.listen(8080, () => {
    console.log('Server Running!');
});