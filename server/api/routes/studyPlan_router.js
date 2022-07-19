'use strict'

const studyPlanDao = require('../modules/studyPlan_dao')
const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')

const isLoggedIn = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next()
   }
   return res.status(401).end()
}

router.get('/studyPlans/plan', isLoggedIn, async (req, res) => {
   try {
      const data = await studyPlanDao.getStudyPlan(req.user.email)
      return res.status(200).json(data)
   } catch (err) {
      return res.status(err.status).json(err.body)
   }
})

router.post(
   '/studyPlan',
   [
      body('courses').isArray().not().isEmpty(),
      body('partTime').isBoolean().not().isEmpty(),
      isLoggedIn,
   ],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(422).end()
      }

      try {
         await studyPlanDao.createStudyPlan(req.user.email, req.body, true)
         return res.status(201).end()
      } catch (err) {
         return res.status(err.status).json(err.body)
      }
   }
)

router.delete('/studyPlans/plan', isLoggedIn, async (req, res) => {
   try {
      await studyPlanDao.deleteStudyPlan(req.user.email)
      return res.status(204).end()
   } catch (err) {
      return res.status(err.status).json(err.body)
   }
})

module.exports = router
