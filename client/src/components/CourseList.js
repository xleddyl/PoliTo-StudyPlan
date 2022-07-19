import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import Course from './Course'

function CourseList(props) {
   const [query, setQuery] = useState('')

   //props
   const courses = props.courses
   const title = props.title
   const search = props.search
   const mode = props.mode
   const action = props.action
   const checkConflicts = props.checkConflicts
   const currentCredits = props.currentCredits
   const partTime = props.partTime

   return (
      <Col className={'mb-5'}>
         <Form onSubmit={(event) => event.preventDefault()}>
            <Row>
               <Col className={'col-8'}>
                  <h2>{title}</h2>
               </Col>
               <Col className={'col-4 d-flex justify-content-end'}>
                  {search && (
                     <Form.Group className={'d-flex'}>
                        <Form.Control
                           id='search'
                           type='text'
                           value={query}
                           placeholder='search ...'
                           required={true}
                           onChange={(event) => {
                              setQuery(event.target.value)
                           }}
                        />
                     </Form.Group>
                  )}
               </Col>
            </Row>
         </Form>
         {courses.length !== 0 &&
            courses
               .filter(
                  (course) =>
                     course.name.toLowerCase().includes(query.toLowerCase()) ||
                     course.code.toLowerCase().includes(query.toLowerCase())
               )
               .map((course) => {
                  let conflictsOnIncompatible = false
                  let conflictsOnRequired = false
                  let conflictsOnFull = false
                  let conflictsOnCredits = false
                  let cantBeRemoved = false

                  if (checkConflicts !== undefined) {
                     if (mode === 'add') {
                        //check incompatible
                        checkConflicts.forEach((code) => {
                           if (
                              course.incompatibleWith != null &&
                              course.incompatibleWith.includes(code)
                           ) {
                              conflictsOnIncompatible = true
                           }
                        })

                        //check required
                        if (
                           course.preparatoryCourse != null &&
                           !checkConflicts.includes(course.preparatoryCourse)
                        ) {
                           conflictsOnRequired = true
                        }

                        //check full
                        if (
                           course.maxStudents != null &&
                           course.enrolledStudents === course.maxStudents
                        ) {
                           conflictsOnFull = true
                        }

                        //check max credits
                        const tmp = currentCredits + course.credits
                        conflictsOnCredits = partTime ? tmp > 40 : tmp > 80
                     }

                     if (mode === 'remove') {
                        //check cant be removed
                        courses.forEach((c) => {
                           if (c.preparatoryCourse != null && c.preparatoryCourse === course.code) {
                              cantBeRemoved = true
                           }
                        })

                     }
                  }

                  const errMsg = [
                     conflictsOnIncompatible ? 'Incompatible courses' : undefined,
                     conflictsOnRequired ? 'Missing preparatory courses' : undefined,
                     conflictsOnFull ? 'Course is full' : undefined,
                     conflictsOnCredits ? 'Reached max credits' : undefined,
                     cantBeRemoved ? 'Preparatory for one or more courses' : undefined,
                  ]
                  return (
                     <Row key={course.code} className={'my-3'} id={course.code}>
                        <Course
                           course={course}
                           mode={mode}
                           action={action}
                           disabled={
                              conflictsOnIncompatible ||
                              conflictsOnRequired ||
                              conflictsOnFull ||
                              conflictsOnCredits ||
                              cantBeRemoved
                           }
                           errMsg={errMsg}
                        />
                     </Row>
                  )
               })}
         {courses.length === 0 && (
            <Row className={'empty-list my-4 d-flex align-content-center'}>
               <Col className={'col-12 mb-2 d-flex justify-content-center'}>
                  <FontAwesomeIcon className={'mx-2'} icon={solid('face-sad-cry')} />
               </Col>
               <Col className={'col-12 d-flex justify-content-center'}>
                  <b>
                     <i>So empty...</i>
                  </b>
               </Col>
            </Row>
         )}
      </Col>
   )
}

export default CourseList
