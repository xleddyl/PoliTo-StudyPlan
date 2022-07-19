const APIURL = 'http://localhost:3001/api/v1'

async function getStudyPlan() {
   const url = APIURL + '/studyPlans/plan'

   try {
      const response = await fetch(url, {
         credentials: 'include'
      })
      if (response.ok) {
         const studyPlan = await response.json()
         return studyPlan
      } else {
         const text = await response.text()
         throw new TypeError(text)
      }
   } catch (err) {
      console.log(err)
      throw err
   }
}

async function editStudyPlan(courses, partTime) {
   const url = APIURL + '/studyPlan'

   try {
      const response = await fetch(url, {
         method: 'POST',
         credentials: 'include',
         body: JSON.stringify({
            partTime: partTime,
            courses: courses,
         }),
         headers: {
            'Content-Type': 'application/json',
         },
      })
      if (response.ok) {
         return true
      } else {
         const text = await response.text()
         throw new TypeError(text)
      }
   } catch (err) {
      console.log(err)
      throw err
   }
}

async function deleteStudyPlan() {
   const url = APIURL + '/studyPlans/plan'

   try {
      const response = await fetch(url, {
         method: 'DELETE',
         credentials: 'include'
      })
      if (response.ok) {
         return true
      } else {
         const text = await response.text()
         throw new TypeError(text)
      }
   } catch (err) {
      console.log(err)
      throw err
   }
}

const StudyPlanAPI = { getStudyPlan, editStudyPlan, deleteStudyPlan }
export default StudyPlanAPI
