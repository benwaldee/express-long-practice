//app.js structure

//1 dependency imports (requires that arent routes)
//2 router imports
//3 configurations (middleware / changing express - wrapped in middleware l24/17)
//4 router middlewares (route handling - ends with catch all error creation)
//5 error handlers



const express = require('express');
require('express-async-errors');

// require('dotenv').config();

const app = express();
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


//phase 2 top
app.use((req, res, next) => {
  console.log(req.method)
  console.log(req.url)
  //phase4
  console.log(process.env.SECRET)

  res.on('finish', () => {
    console.log(res.statusCode)
  });

  next()
})


//phase 3
const { router } = require('./routes/dogs')
const { validateDogId } = require('./routes/dogs')
app.use('/dogs', router)

//phase 5
const dogFoodRouter = require('./routes/dog-foods')
app.use('/dogs/:dogId', validateDogId)
app.use('/dogs', dogFoodRouter)



//phase 2 bottom
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.")
  err.statusCode = 404
  next(err)
})

app.use((err, req, res, next) => {

  const errCode = err.statusCode || 500
  console.log("message", err.message,
    "statusCode", errCode)
  // res.status(errCode)
  // res.json({
  //   "message": err.message,
  //   "statusCode": errCode
  // })
  next(err)
})

//phase 4 -error handling
app.use((err, req, res, next) => {
  console.log(err.message)
  res.status(err.statusCode || 500)
  const errCode = err.statusCode || 500
  console.log(process.env.NODE_ENV)
  if (process.env.NODE_ENV !== 'production') {
    res.json(
      {
        "message": err.message || "Something went wrong",
        "statusCode": errCode,
        "stack": err.stack
      })
  } else {
    res.json(
      {
        "message": err.message || "Something went wrong",
        "statusCode": errCode,
      })
  }
})



const port = 5000;
app.listen(port, () => console.log('Server is listening on port', port));
