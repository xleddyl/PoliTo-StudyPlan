'use strict'

const courseDao = require('../modules/course_dao')
const express = require('express')
const router = express.Router()
const { param, validationResult } = require('express-validator')

router.get('/courses', async (req, res) => {
   try {
      const data = await courseDao.getCourses()
      return res.status(200).json(data)
   } catch (err) {
      return res.status(err.status).json(err.body)
   }
})

router.get(
   '/courses/:code',
   [param('code').isAlphanumeric().isLength(7)],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(422).end()
      }

      try {
         const data = await courseDao.getCourse(req.params.code)
         return res.status(200).json(data)
      } catch (err) {
         return res.status(err.status).json(err.body)
      }
   }
)

module.exports = router
