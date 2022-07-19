const APIURL = 'http://localhost:3001/api/v1'

async function getCourses() {
   const url = APIURL + '/courses'

   try {
      const response = await fetch(url, {
         credentials: 'include',
      })
      if (response.ok) {
         const courses = await response.json()
         return courses.sort((x, y) => (x.name > y.name ? 1 : -1))
      } else {
         const text = await response.text()
         throw new TypeError(text)
      }
   } catch (err) {
      console.log(err)
      throw err
   }
}

async function getCourse(code) {
   const url = APIURL + '/courses/' + code

   try {
      const response = await fetch(url, {
         credentials: 'include',
      })
      if (response.ok) {
         const course = await response.json()
         return course
      } else {
         const text = await response.text()
         throw new TypeError(text)
      }
   } catch (err) {
      console.log(err)
      throw err
   }
}

const CourseAPI = { getCourses, getCourse }
export default CourseAPI
