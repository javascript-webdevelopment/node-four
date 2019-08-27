const express = require('express');
const cors = require('cors');

// App
const app = express();

// TLM
app.use(express.json());
app.use(cors());

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
        // invoke next and pass in the user
        next()
    } else {
        res.status(403).send('Invalid username or password');
    }
};

// End Point to login
app.post('/api/login', authenticateUser, (req, res) => {
    // send back user object
    res.status(200).send(user);
});

// App Listening
app.listen(8080, () => {
    console.log('Server Running!');
});