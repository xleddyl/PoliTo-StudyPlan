import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { Alert, Button, Col, Row } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import CourseList from './CourseList'

function Plan(props) {
   const auth = useContext(AuthContext)

   //props
   const setSidebarButtonState = props.setSidebarButtonState
   const studyPlan = props.studyPlan
   const mode = props.mode
   const partTime = props.partTime
   const setPartTime = props.setPartTime

   const [courses, setCourses] = useState(props.courses)
   const [errMsg, setErrMsg] = useState('')
   const [studyPlanCodes, setStudyPlanCodes] = useState(studyPlan.map((course) => course.code))
   //const [inPlanCourses, setInPlanCourses] = useState()
   //const [offPlanCourses, setOffPlanCourses] = useState()
   const credits = courses
      .filter((course) => studyPlanCodes.includes(course.code))
      .reduce((tot, course) => tot + course.credits, 0)

   const navigate = useNavigate()

   useEffect(() => {
      if (!auth.login) {
         navigate('/')
      }
   }, [auth.login, navigate])

   const createPlan = (partTime) => {
      setPartTime(partTime)
      setSidebarButtonState(false)
      navigate('/plan/edit')
   }

   const removeFromPlan = (code) => {
      setCourses((old) =>
         old.map((c) => {
            if (c.code === code) {
               c.enrolledStudents--
               return c
            }
            return c
         })
      )
      setStudyPlanCodes((old) => old.filter((oldCode) => oldCode !== code))
   }

   const addToPlan = (code) => {
      setCourses((old) =>
         old.map((c) => {
            if (c.code === code) {
               c.enrolledStudents++
               return c
            }
            return c
         })
      )
      setStudyPlanCodes((old) => [code, ...old])
   }

   const savePlan = async () => {
      const err = await props.savePlan(studyPlanCodes, partTime)
      if (!err) {
         setErrMsg(String(''))
         setSidebarButtonState(true)
         navigate('/plan')
      } else {
         setErrMsg(String(err))
      }
   }

   const deletePlan = async () => {
      const err = await props.deletePlan()
      if (!err) {
         setErrMsg(String(''))
         setSidebarButtonState(true)
         navigate('/plan')
      } else {
         setErrMsg(String(err))
      }
   }

   const closeEditing = () => {
      setStudyPlanCodes(studyPlan.map((course) => course.code))
      setSidebarButtonState(true)
      navigate('/plan')
   }

   return (
      <>
         <Col>
            {errMsg && (
               <Alert className={'mt-3'} variant='danger'>
                  {errMsg}
               </Alert>
            )}

            {(auth.user.hasStudyPlan || mode === 'edit') && (
               <Row className={'bg-light sticky-top py-3'}>
                  <Col>
                     <Row className={'toolbar'}>
                        <Col>
                           <h2>{'Credits: ' + credits}</h2>
                           <h6>
                              {'min: ' +
                                 (partTime ? '20' : '60') +
                                 ' / max: ' +
                                 (partTime ? '40' : '80')}
                           </h6>
                        </Col>
                        {mode === 'edit' && (
                           <Col className={'d-flex justify-content-end'}>
                              <Button
                                 type='submit'
                                 variant='outline-secondary'
                                 onClick={() => closeEditing()}>
                                 <FontAwesomeIcon className={'mx-2'} icon={solid('times')} />
                                 Cancel
                              </Button>
                              <Button
                                 type='submit'
                                 variant='outline-danger'
                                 className={'mx-3'}
                                 onClick={() => deletePlan()}>
                                 <FontAwesomeIcon className={'mx-2'} icon={solid('trash')} />
                                 Delete
                              </Button>
                              <Button
                                 type='submit'
                                 variant='success'
                                 disabled={partTime ? credits < 20 : credits < 60}
                                 onClick={() => savePlan()}>
                                 <FontAwesomeIcon className={'mx-2'} icon={solid('floppy-disk')} />
                                 Save
                              </Button>
                           </Col>
                        )}
                     </Row>
                  </Col>
               </Row>
            )}

            {!auth.user.hasStudyPlan && mode === 'view' && (
               <Row className={'d-flex align-content-center pt-3'}>
                  <div className={'create-plan'}>
                     <Col className={'col-12 d-flex justify-content-center align-items-center'}>
                        <FontAwesomeIcon className={'mx-2'} icon={solid('face-smile')} />
                        <b>
                           <i>Define a new plan</i>
                        </b>
                     </Col>
                     <Row className={'mt-5'}>
                        <Button type='submit' variant='secondary' onClick={() => createPlan(false)}>
                           <h5>Full Time</h5>
                        </Button>
                        <Button
                           type='submit'
                           variant='secondary'
                           className={'mt-2'}
                           onClick={() => createPlan(true)}>
                           <h5>Part Time</h5>
                        </Button>
                     </Row>
                  </div>
               </Row>
            )}

            {(auth.user.hasStudyPlan || mode === 'edit') && (
               <>
                  <Col>
                     <CourseList
                        action={removeFromPlan}
                        mode={mode === 'edit' ? 'remove' : undefined}
                        title={'Defined plan'}
                        search={'true'}
                        checkConflicts={studyPlanCodes}
                        courses={courses.filter((course) => studyPlanCodes.includes(course.code))}
                     />
                  </Col>
                  <Col className={'mt-5'}>
                     <CourseList
                        action={addToPlan}
                        mode={mode === 'edit' ? 'add' : undefined}
                        title={mode === 'edit' ? 'Select courses from this list' : 'All courses'}
                        search={'true'}
                        checkConflicts={studyPlanCodes}
                        currentCredits={credits}
                        partTime={partTime}
                        courses={mode === 'edit' ? courses.filter((course) => !studyPlanCodes.includes(course.code)) : courses}
                     />
                  </Col>
               </>
            )}
         </Col>
      </>
   )
}

export default Plan
