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

### Request Level

On an endpoint we can setup a middlware function that is only invoked when a specific enpoint is hit. This is referred to as `request level middleware`.

We can chain multiple request level middleware functions onto an endpoint before we hit the handler function. This works just like the TLM function that we wrote above. The RLM function will take in `req`, `res`, and `next` as arguments.

```js
app.get('/api/rlm', function(req,res,next){
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