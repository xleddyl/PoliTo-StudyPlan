import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useContext, useState } from 'react'
import { Alert, Button, Col, Form, Image, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

function Sidebar(props) {
   const navigate = useNavigate()
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [errMsg, setErrMsg] = useState('')
   const auth = useContext(AuthContext)

   //props
   const setSidebarButtonState = props.setSidebarButtonState
   const sidebarButtonState = props.sidebarButtonState

   const login = async (event) => {
      event.preventDefault()
      const err = await props.login(email, password)
      if (!err) {
         setErrMsg(String(''))
         navigate('/plan')
      } else {
         setErrMsg(String(err))
      }
   }

   const logout = async () => {
      const err = await props.logout()
      if (!err) {
         setErrMsg(String(''))
         navigate('/')
      } else {
         setErrMsg(String(err))
      }
   }

   return (
      <>
         <Row className={'sticky-top d-flex justify-content-center pt-3 mx-2'}>
            <div className={'user-profile'}>
               {auth.login && (
                  <Col>
                     <Row className={'justify-content-center'}>
                        <Row className={'mb-3'}>
                           <Col className={'col-5 d-flex justify-content-center align-items-start'}>
                              <Image
                                 roundedCircle
                                 src={auth.propic}
                                 alt={'propic'}
                                 className={'propic'}
                              />
                           </Col>
                           <Col className={'col-7 align-content-stretch'}>
                              <h4>{auth.user.name + ' ' + auth.user.surname}</h4>
                              {auth.user.hasStudyPlan && (
                                 <Col className={'col-12'}>
                                    <h6>{auth.user.partTime ? 'Part Time' : 'Full Time'}</h6>
                                 </Col>
                              )}
                              <Col
                                 className={
                                    'col-12 ' + (auth.user.hasStudyPlan ? 'available' : 'full')
                                 }>
                                 <h6>
                                    {auth.user.hasStudyPlan ? 'Plan defined' : 'Plan not defined'}
                                 </h6>
                              </Col>
                           </Col>
                        </Row>
                        <Row>
                           <Button
                              type='submit'
                              variant='outline-secondary'
                              disabled={!sidebarButtonState || !auth.user.hasStudyPlan}
                              className={'btn-block mb-2'}
                              onClick={() => {
                                 setSidebarButtonState(false)
                                 navigate('/plan/edit')
                              }}>
                              <FontAwesomeIcon className={'mx-2'} icon={solid('pencil')} />
                              Edit Plan
                           </Button>
                           <Button
                              type='submit'
                              variant='outline-danger'
                              disabled={!sidebarButtonState}
                              className={'btn-block'}
                              onClick={() => logout()}>
                              <FontAwesomeIcon
                                 className={'mx-2'}
                                 icon={solid('right-from-bracket')}
                              />
                              Logout
                           </Button>
                        </Row>
                     </Row>
                     {errMsg && (
                        <Alert className={'mt-3'} variant='danger'>
                           {errMsg}
                        </Alert>
                     )}
                  </Col>
               )}
               {!auth.login && (
                  <Col>
                     <h4>Login to edit your StudyPlan</h4>
                     <Form onSubmit={login}>
                        <Row className={'justify-content-center'}>
                           <Col className={'col-12'}>
                              <Form.Group className='mb-3'>
                                 <Form.Label>email</Form.Label>
                                 <Form.Control
                                    type='text'
                                    value={email}
                                    placeholder='name.surname@studenti.it'
                                    required={true}
                                    onChange={(event) => {
                                       setEmail(event.target.value)
                                    }}
                                 />
                              </Form.Group>
                           </Col>
                           <Col className={'col-12'}>
                              <Form.Group className='mb-3'>
                                 <Form.Label>password</Form.Label>
                                 <Form.Control
                                    type='password'
                                    value={password}
                                    required={true}
                                    onChange={(event) => {
                                       setPassword(event.target.value)
                                    }}
                                 />
                              </Form.Group>
                           </Col>
                           <Row>
                              <Button
                                 type='submit'
                                 variant='outline-success'
                                 disabled={!sidebarButtonState}
                                 className={'btn-block'}>
                                 <FontAwesomeIcon
                                    className={'mx-2'}
                                    icon={solid('right-to-bracket')}
                                 />
                                 Login
                              </Button>
                           </Row>
                        </Row>
                     </Form>
                     {errMsg && (
                        <Alert className={'mt-3'} variant='danger'>
                           {errMsg}
                        </Alert>
                     )}
                  </Col>
               )}
            </div>
         </Row>
      </>
   )
}

export default Sidebar
