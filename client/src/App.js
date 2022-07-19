import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './css/App.css'
import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CourseAPI from './api/CourseAPI'
import LoginAPI from './api/LoginAPI'
import CryptoJS from 'crypto-js'
import MainLayout from './components/MainLayout'
import AuthContext from './context/AuthContext'
import CourseList from './components/CourseList'
import Plan from './components/Plan'
import StudyPlanAPI from './api/StudyPlanAPI'

function App() {
   const defUser = { hasStudyPlan: false }
   const [partTime, setPartTime] = useState(false)
   const [sidebarButtonState, setSidebarButtonState] = useState(true)
   const [auth, setAuth] = useState({
      login: false,
      errorMsg: '',
      user: defUser,
      propic: '',
   })
   const [courses, setCourses] = useState([])
   const [studyPlan, setStudyPlan] = useState([])

   // load all the courses at every render
   useEffect(() => {
      async function load() {
         const courses = await CourseAPI.getCourses()
         setCourses(courses)
      }
      load()
   }, [])

   // login user
   const login = async (email, password) => {
      try {
         const user = await LoginAPI.login(email, password)
         if (user.hasStudyPlan) {
            const studyPlan = await StudyPlanAPI.getStudyPlan()
            setStudyPlan(studyPlan)
         }
         setAuth({
            login: true,
            user: user,
            propic:
               'https://www.gravatar.com/avatar/' +
               CryptoJS.MD5(user.email) +
               '?d=robohash&r=g&s=200',
         })
      } catch (err) {
         return err
      }
   }

   // logout user
   const logout = async () => {
      try {
         await LoginAPI.logout()
         setStudyPlan([])
         setAuth({
            login: false,
            user: defUser,
            propic: '',
         })
      } catch (err) {
         return err
      }
   }

   const savePlan = async (codes, partTime) => {
      try {
         await StudyPlanAPI.editStudyPlan(codes, partTime)
         const user = await LoginAPI.refresh()
         const studyPlan = await StudyPlanAPI.getStudyPlan()
         const courses = await CourseAPI.getCourses()
         setStudyPlan(studyPlan)
         setCourses(courses)
         setAuth({
            login: true,
            user: user,
            propic:
               'https://www.gravatar.com/avatar/' +
               CryptoJS.MD5(user.email) +
               '?d=robohash&r=g&s=200',
         })
      } catch (err) {
         return err
      }
   }

   const deletePlan = async () => {
      try {
         const tmp = await StudyPlanAPI.deleteStudyPlan()
         const courses = await CourseAPI.getCourses()
         const user = await LoginAPI.refresh()
         setStudyPlan([])
         setCourses(courses)
         setAuth({
            login: true,
            user: user,
            propic:
               'https://www.gravatar.com/avatar/' +
               CryptoJS.MD5(user.email) +
               '?d=robohash&r=g&s=200',
         })
      } catch (err) {
         return err
      }
   }

   return (
      <BrowserRouter>
         <AuthContext.Provider value={auth}>
            <Routes>
               <Route
                  path='/'
                  element={
                     <MainLayout
                        login={login}
                        logout={logout}
                        setSidebarButtonState={setSidebarButtonState}
                        sidebarButtonState={sidebarButtonState}
                     />
                  }>
                  <Route
                     exact
                     index
                     element={<CourseList title={'All courses'} search={true} courses={courses} />}
                  />
                  <Route
                     exact
                     path='plan'
                     element={
                        <Plan
                           courses={courses}
                           studyPlan={studyPlan}
                           setSidebarButtonState={setSidebarButtonState}
                           mode={'view'}
                           partTime={auth.user.partTime}
                           setPartTime={setPartTime}
                        />
                     }
                  />
                  <Route
                     exact
                     path='plan/edit'
                     element={
                        <Plan
                           courses={courses}
                           studyPlan={studyPlan}
                           setSidebarButtonState={setSidebarButtonState}
                           mode={'edit'}
                           savePlan={savePlan}
                           deletePlan={deletePlan}
                           partTime={partTime}
                        />
                     }
                  />
                  <Route path='*' element={<Navigate to='/' replace />} />
               </Route>
            </Routes>
         </AuthContext.Provider>
      </BrowserRouter>
   )
}

export default App
