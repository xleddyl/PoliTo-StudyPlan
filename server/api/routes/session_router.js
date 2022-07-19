'use strict'

const loginDao = require('../modules/login_dao')
const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local')

// passport
passport.use(
   new LocalStrategy(
      {
         usernameField: 'email',
         passwordField: 'password',
      },
      async function verify(email, password, callback) {
         try {
            const user = await loginDao.login(email, password)
            return callback(null, user)
         } catch (err) {
            return callback(null, false, err)
         }
      }
   )
)

passport.serializeUser(function (user, callback) {
   return callback(null, user)
})

passport.deserializeUser(async function (user, callback) {
   return callback(null, user)
})

// routes
router.get('/sessions/current', async (req, res) => {
   if (req.isAuthenticated()) {
      const user = await loginDao.getSession(req.user.email)
      res.status(200).json(user)
   } else {
      res.status(401).end()
   }
})

router.post('/session', passport.authenticate('local'), (req, res) => {
   return res.status(201).json(req.user)
})

router.delete('/sessions/current', (req, res) => {
   req.logout(() => {
      res.status(204).end()
   })
})

module.exports = router
