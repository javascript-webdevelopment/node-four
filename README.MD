# Node Four

In this lesson we talk about middleware, cookies, and sessions in our Node server.

## Middleware

A middleware function is a function that is executed between an endpoint being hit and the handler function that sends a response. They will act like the `middle man` in our requests.

A middleware function expects three arguments, `req`, `res`, and `next`.

```js
function middleware(req, res, next){}
```

`req` - This is the object of the request, we can use this to access data such as the body, params, and query.

`res` - This is the response object for the request, we can use this to send bacl data.

`next` - This is a function that we will need to invoke to move onto the function.

### Top Level Middleware

Top level middleware is a middleware function that is executed upon each request made to our server.

We can create a top level middlware function by passing the function into `app.use()`. It's important to make sure that these are around the top of the server so they are hit before the endpoints.

```js
app.use((req, res, next) => {
    console.log('custom tlm hit!')
    // invoke next to move onto the next funciton in the req
    next();
});
```

In the example above we are just passing in an annonymous function, however we can declare that function elsewhere and pass it in.

We can pass an optional path as an argument to our `app.use()` function to specify what end points to use the midleware function on.

```js
app.use('/api/users', (req, res, next) => {
    console.log('user route hit!')
    next();
})
```

### Request Level

On an endpoint we can setup a middlware function that is only invoked when a specific enpoint is hit. This is referred to as `request level middleware`.

We can chain multiple request level middleware functions onto an endpoint before we hit the handler function. This works just like the TLM function that we wrote above. The RLM function will take in `req`, `res`, and `next` as arguments.

```js
app.get('/api/test', function(req,res,next){
    console.log('callback one')
    next();
}, function(req,res,next){
    console.log('callback two')
    next();
}, function(req,res){
    console.log('callback three')
    res.send('Send a response!');
});
```

Above we have two RLM functions being executed before we hit our handler function and send b ack a response to our front end.

These middleware functions are great because we can use it to check for specific conditions to allow a user to keep moving on in the end point. A great example of this is setting up a middleware function to authenticate a user to login.

```js
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
        // if username and password matches
        // invoke next and pass in the user and move onto the next function in the end point
        next()
    } else {
        res.status(403).send('Invalid username or password');
    };
};

// End Point to login
app.post('/api/login', authenticateUser, (req, res) => {
    // send back user object
    res.status(200).send(user);
});
```

## Cookies

A `cookie` is a small little file that will be stored onto your browser with some information. These are very small and are limited to 4kb of data.

HTTP requests are `stateless` meaning they do not remember data from previous requests. In this case, if we wanted to log our user in, they would need to send their login information upon every request so we know who they are. This is terrible for a website and we don't want to have it like this.

How do we get around this so we can just send our data one time and be remembered? We will create a `session` to keep track of their data by using a `cookie`.

### Session

Imagine that you go to a cafe to order a drink and then next week you back, the workers will most likely not remember you or what your ordered so you'll have to reorder. But what if they created a system where you can save your order based off of your personal ID, so now when you go to the cafe you just give them your id and they remember everything else about your order.

* The personal ID is the cookie in your browser storing your order

* The cafe is the server

* The information keeping track of your id and others id will be the session

We will be using a library called `express-session` to create the session store. Then we will use middleware to create a session for the user in our server and send back a `cookie` that will be stored to the browser with a `session id`.

![sessions](images/session.png)

Go ahead and install the library in our project by running the terminal command

```bash
$ npm install express-session
```

Then we will require it at the top of the file

```js
const session = require('express-session');
```

Then we will be using this as Top Level Middleware

```js
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: {maxAge: 60000}
}));
```

The object that we passed in is known as the `configuration` object. We will configure the `resave`, `saveUninitialized`, and `secret`.

`secret` - This will be a random string to keep our session secret. This will ensure intregity of the cookie.

`saveUninitialized` - This will say when a session is created and no data is changed or added if we still want to save it to the store. Set it to true by default.

`resave` - This means that if nothing on the session was changed or modified do we want to save it to the store. Set it to false by default.

`cookie` - This will be an object that we can set an expiration in milliseconds to the cookie session.

We can now access any information from the session on the `req.session` object. We can put any information that we want to on to the session.

```js
const express = require('express');
const cors = require('cors');
const session = require('express-session');

app.use(express.json());
app.use(cors());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'keyboard cat yo',
    cookie: {maxAge: 60000}
}));

let user = {
    username: 'tayte123',
    password: 'password123',
    full_name: 'Tayte Stokes',
    color: 'black'
};

const authenticateUser = (req, res, next) => {
    const {username, password} = req.body;
    if(username === user.username && password === user.password){
        req.session.user = user;
        next()
    } else {
        res.status(403).send('Invalid username or password');
    }
};

app.post('/api/login', authenticateUser, (req, res) => {
    console.log(req.session)
    res.status(200).send(user);
});

app.listen(8080, () => {
    console.log('Server Running!');
});
```