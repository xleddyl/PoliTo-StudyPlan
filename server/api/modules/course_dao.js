'use strict'

const sqlite = require('sqlite3')

const db = new sqlite.Database('./db/database.db', (err) => {
   if (err) throw err
   db.run('PRAGMA foreign_keys = ON')
})

exports.getCourses = () => {
   return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Courses`
      db.all(sql, async (err, rows) => {
         try {
            if (err) throw err
            const data = await Promise.all(
               rows.map(async (row) => await this.getCourse(row.code))
            )
            return resolve(data)
         } catch (err) {
            return reject({ status: 500, body: err })
         }
      })
   })
}

exports.getCourse = (code) => {
   return new Promise(async (resolve, reject) => {
      try {
         const incompatibleWith = await getIncompatibleCourses(code)
         const sql = ` SELECT * FROM Courses WHERE code = ?`
         db.get(sql, [code], (err, row) => {
            if (err) throw err
            if (row === undefined)
               return reject({ status: 404, body: 'not found' })
            row.incompatibleWith =
               incompatibleWith.length !== 0 ? incompatibleWith : null
            return resolve(row)
         })
      } catch (err) {
         return reject({ status: 500, body: err })
      }
   })
}

const getIncompatibleCourses = (code) => {
   return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Courses_Incompatible WHERE course = ?`
      db.all(sql, [code], (err, rows) => {
         if (err) return reject(err)
         return resolve(rows.map((row) => row.incompatibleWith))
      })
   })
}
