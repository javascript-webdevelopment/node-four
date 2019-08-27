const express = require('express');
const cors = require('cors');

// App
const app = express();

// TLM
app.use(express.json());
app.use(cors());

// Custom TLM
app.use((req, res, next) => {
    console.log('custom tlm hit!')
    // invoke next to move onto the next funciton in the req
    next();
});



// EndPoints
app.get('/api', (req, res) => res.send('Hello'))

// App Listening
app.listen(8080, () => {
    console.log('Server Running!');
});