'use strict'

const sqlite = require('sqlite3')
const crypto = require('crypto')

const db = new sqlite.Database('./db/database.db', (err) => {
   if (err) throw err
   db.run('PRAGMA foreign_keys = ON')
})

exports.login = (email, password) => {
   return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Students WHERE email = ?`
      db.get(sql, [email], (err, row) => {
         if (err) return reject(err)
         if (row === undefined) return reject(undefined)
         const user = {
            email: row.email,
            name: row.name,
            surname: row.surname,
            hasStudyPlan: Boolean(row.hasStudyPlan),
            partTime: Boolean(row.partTime),
         }
         crypto.scrypt(password, row.salt, 32, function (err, hashedPwd) {
            if (err) return reject(err)
            if (
               !crypto.timingSafeEqual(
                  Buffer.from(row.password, 'hex'),
                  hashedPwd
               )
            ) {
               return reject(undefined)
            }
            return resolve(user)
         })
      })
   })
}

exports.getSession = (email) => {
   return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM Students WHERE email = ?`
      db.get(sql, [email], (err, row) => {
         if (err) return reject(err)
         const user = {
            email: row.email,
            name: row.name,
            surname: row.surname,
            hasStudyPlan: Boolean(row.hasStudyPlan),
            partTime: Boolean(row.partTime),
         }
         return resolve(user)
      })
   })
}
