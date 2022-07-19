import { Accordion, Col, Container, Row } from 'react-bootstrap'
import { HashLink } from 'react-router-hash-link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

function Course(props) {
   //props
   const course = props.course
   const mode = props.mode
   const disabled = props.disabled
   const errMsg = props.errMsg
   const action = props.action

   const clickEvent = (event) => {
      event.stopPropagation()
      if (!disabled) action(course.code)
   }

   return (
      <>
         <Accordion className={disabled ? 'disabled' : ''}>
            <Accordion.Item eventKey={course.code}>
               <Accordion.Header>
                  <Container className={'py-3'}>
                     <Row>
                        <Col
                           className={
                              'col-1 d-flex justify-content-center align-items-center ' +
                              (disabled ? 'disabled' : '')
                           }>
                           {mode && (
                              <FontAwesomeIcon
                                 className={'btn button ' + (mode === 'add' ? 'available' : 'full')}
                                 icon={
                                    mode === 'add' ? solid('circle-plus') : solid('circle-minus')
                                 }
                                 onClick={(event) => clickEvent(event)}
                              />
                           )}
                        </Col>
                        <Col className={'col-11'}>
                           <Col className={'col-12 code'}>{course.code}</Col>
                           <Col className={'col-12'}>
                              <Row>
                                 <Col className={'col-8 h5'}>{course.name}</Col>
                                 <Col className={'col-2 h6'}>{course.credits} cfu</Col>
                                 <Col
                                    className={
                                       'col-2 h6 ' +
                                       (course.maxStudents != null &&
                                       course.enrolledStudents === course.maxStudents
                                          ? 'full'
                                          : 'available')
                                    }>
                                    {course.enrolledStudents +
                                       '/' +
                                       (course.maxStudents == null ? '∞' : course.maxStudents)}
                                 </Col>
                              </Row>
                           </Col>
                           <Row className={'cant-be-added'}>
                              {errMsg.map(
                                 (err, i) =>
                                    err && (
                                       <Col key={i} className={'col-12 d-flex align-items-center'}>
                                          <FontAwesomeIcon
                                             className={'mx-2'}
                                             icon={solid('triangle-exclamation')}
                                          />
                                          {err}
                                       </Col>
                                    )
                              )}
                           </Row>
                        </Col>
                     </Row>
                  </Container>
               </Accordion.Header>
               <Accordion.Body>
                  <Container>
                     <Row>
                        <Col className={'col-sm-6 col-12 d-flex justify-content-center'}>
                           <span>
                              {'Incompatible courses: '}
                              <h6>
                                 {course.preparatoryCourse && (
                                    <HashLink
                                       smooth
                                       to={'#' + course.preparatoryCourse}
                                       className={'p-0 m-0'}>
                                       {course.preparatoryCourse}
                                    </HashLink>
                                 )}
                                 {!course.preparatoryCourse && 'none'}
                              </h6>
                           </span>
                        </Col>
                        <Col className={'col-sm-6 col-12 d-flex justify-content-center'}>
                           <span>
                              {'Incompatible courses: '}
                              <h6>
                                 {course.incompatibleWith &&
                                    course.incompatibleWith.map((c) => (
                                       <HashLink smooth to={'#' + c} className={'p-0 m-0'}>
                                          {c}
                                       </HashLink>
                                    ))}
                                 {!course.incompatibleWith && 'none'}
                              </h6>
                           </span>
                        </Col>
                     </Row>
                  </Container>
               </Accordion.Body>
            </Accordion.Item>
         </Accordion>
      </>
   )
}

export default Course
