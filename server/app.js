const express = require('express');
const app = express();
require('express-async-errors');
//phase 1

app.use('/static', express.static('assets'))

//going into the folder from the requrl
//grabbing wahts in there
//res.send(what it grabbed)
//responding will stop the code below from running (without a next)

app.use(express.json());

// For testing purposes, GET /
// URL /static/images/dog1.jpg
app.get('/', (req, res) => {
  res.json("Express server running. No content provided at root level. Please use another route.");
});

// For testing express.json middleware
app.post('/test-json', (req, res, next) => {
  // send the body as JSON with a Content-Type header of "application/json"
  // finishes the response, res.end()
  res.json(req.body);
  next();
});

// For testing express-async-errors
app.get('/test-error', async (req, res) => {
  throw new Error("Hello World!")
});


//phase 2
app.use((req, res, next) => {
  console.log(req.method)
  console.log(req.url)

  res.on('finish', () => {
    console.log(res.statusCode)
  });

  next()
})


app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.")
  err.statusCode = 404
  next(err)
})

app.use((err, req, res, next) => {

  const errCode = err.statusCode || 500
  console.log("message", err.message,
    "statusCode", errCode)
  res.json({
    "message": err.message,
    "statusCode": errCode
  })

})

const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
