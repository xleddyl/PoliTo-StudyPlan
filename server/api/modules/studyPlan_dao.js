'use strict'

const sqlite = require('sqlite3')
const courseDao = require('../modules/course_dao')

const db = new sqlite.Database('./db/database.db', (err) => {
   if (err) throw err
   db.run('PRAGMA foreign_keys = ON')
})

exports.getStudyPlan = (email) => {
   return new Promise(async (resolve, reject) => {
      const student = await getStudent(email)
      const sql = `SELECT * FROM Students_Courses WHERE student = ?`
      db.all(sql, [student.email], async (err, rows) => {
         try {
            if (err) throw err
            const data = await Promise.all(
               rows.map(async (row) => await courseDao.getCourse(row.course))
            )
            return resolve(data)
         } catch (err) {
            return reject({ status: 500, body: err })
         }
      })
   })
}

exports.createStudyPlan = (email, body, post = false) => {
   return new Promise(async (resolve, reject) => {
      try {
         const student = await getStudent(email)

         //check incompatible, required, max enrolled and credits
         const error = await hasConflicts(body.courses, body.partTime, post)
         if (error) {
            return reject({
               status: 422,
               body: error,
            })
         }

         //check if student has study plan
         if (student.hasStudyPlan) await this.deleteStudyPlan(student.email)

         //insert
         await Promise.all(
            body.courses.map(async (course) => {
               await insertStudyPlan(student.email, course)
               await updateCourse('+', course)
            })
         )
         await updateStudent(student.email, true, body.partTime)

         return resolve(201)
      } catch (err) {
         console.log(err)
         return reject({ status: 500, body: err })
      }
   })
}

exports.deleteStudyPlan = (email) => {
   return new Promise(async (resolve, reject) => {
      const student = await getStudent(email)
      if (student.hasStudyPlan) {
         const courses = await this.getStudyPlan(student.email)
         const sql = `DELETE FROM Students_Courses WHERE student = ?`
         db.run(sql, [student.email], async function (err) {
            try {
               if (err) throw err

               // hasStudyPlan false
               await updateStudent(student.email, false)

               // decrement enrolled students
               await Promise.all(
                  courses.map(
                     async (course) => await updateCourse('-', course.code)
                  )
               )
            } catch (err) {
               return reject({ status: 500, body: err })
            }
         })
      }
      return resolve(204)
   })
}

const insertStudyPlan = async (email, course) => {
   return new Promise((resolve, reject) => {
      const sql = `INSERT INTO Students_Courses (student, course) VALUES (?, ?)`
      db.run(sql, [email, course], function (err) {
         if (err) return reject(err)
         return resolve(201)
      })
   })
}

const updateStudent = async (email, hasStudyPlan, partTime) => {
   return new Promise((resolve, reject) => {
      const sql = `UPDATE Students SET hasStudyPlan = ?, partTime = ? WHERE email = ?`
      db.run(sql, [hasStudyPlan ? 1 : 0, hasStudyPlan ? (partTime ? 1 : 0) : 0, email], function (err) {
         if (err) return reject(err)
         return resolve(201)
      })
   })
}

const updateCourse = async (operator, code) => {
   return new Promise((resolve, reject) => {
      const sql = `UPDATE Courses SET enrolledStudents = enrolledStudents ${operator} 1 WHERE code = ?`
      db.run(sql, [code], function (err) {
         if (err) return reject(err)
         return resolve(201)
      })
   })
}

const hasConflicts = async (codes, partTime, post) => {
   const courses = await Promise.all(
      codes.map(async (code) => await courseDao.getCourse(code))
   )

   const credits = courses.reduce((tot, course) => tot + course.credits, 0)
   const conflictsOnCredits = partTime
      ? credits < 20 || credits > 40
      : credits < 60 || credits > 80

   let conflictsOnIncompatible = false
   codes.forEach((code) => {
      courses.forEach((course) => {
         if (
            course.incompatibleWith != null &&
            course.incompatibleWith.includes(code)
         ) {
            conflictsOnIncompatible = true
         }
      })
   })

   let conflictsOnRequired = false
   courses.forEach((course) => {
      if (course.preparatoryCourse != null) {
         let found = false
         codes.forEach((code) => {
            if (course.preparatoryCourse === code) {
               found = true
            }
         })
         if (!found) {
            conflictsOnRequired = true
         }
      }
   })

   let conflictsOnEnrolled = false
   courses.forEach((course) => {
      if(post) {
         if(course.maxStudents != null && (course.maxStudents < course.enrolledStudents)) {
            conflictsOnEnrolled = true
         }
      } else {
         if(course.maxStudents != null && (course.maxStudents < course.enrolledStudents + 1)) {
            conflictsOnEnrolled = true
         }
      }
   })

   const error = conflictsOnCredits
      ? 'invalid credits'
      : conflictsOnIncompatible
      ? 'incompatible courses'
      : conflictsOnRequired
      ? 'missing required courses'
      : conflictsOnEnrolled
      ? 'max enrolled students in one or more courses'
      : undefined

   return error
}

const getStudent = async (email) => {
   return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Students WHERE email = ?`
      db.get(sql, [email], (err, row) => {
         if (err) return reject(err)
         return resolve(row)
      })
   })
}
