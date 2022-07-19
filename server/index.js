'use strict'

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
const session = require('express-session')

const app = express()
const PORT = 3001
const APIURL = '/api/v1'

// middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(
   cors({
      origin: 'http://localhost:3000',
      credentials: true,
   })
)
app.use(
   session({
      secret: '4D635166546A576D5A7134743777217A',
      resave: false,
      saveUninitialized: false,
   })
)
app.use(passport.authenticate('session'))

// urls
const sessionRouter = require('./api/routes/session_router')
app.use(APIURL, sessionRouter)
const courseRouter = require('./api/routes/course_router')
app.use(APIURL, courseRouter)
const studyPlanRouter = require('./api/routes/studyPlan_router')
app.use(APIURL, studyPlanRouter)

// start server
app.listen(PORT, () => {
   console.log(`server started at http://localhost:${PORT}`)
})
