import { Col, Container, Row } from 'react-bootstrap'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

function MainLayout(props) {
   return (
      <>
         <Container fluid className={'p-0 m-0 bg-light'}>
            <Row className={'bg-dark text-white p-3'}>
               <Col className={'col-5 d-flex justify-content-center align-self-center'}>
                  <h1 className={'mx-5'}>StudyPlan</h1>
               </Col>
               <Col className={'col-2'}></Col>
            </Row>
            <Container className={'pb-2'}>
               <Row className={'d-flex justify-content-center m-3'}>
                  <Col className={'col-lg-4 col-12'}>
                     <Sidebar
                        login={props.login}
                        logout={props.logout}
                        setSidebarButtonState={props.setSidebarButtonState}
                        sidebarButtonState={props.sidebarButtonState}
                     />
                  </Col>
                  <Col className={'col-lg-8 col-12'}>
                     <Outlet />
                  </Col>
               </Row>
            </Container>
         </Container>
         <Row className={'footer p-2 fixed-bottom'}>
            <Col className={'d-flex justify-content-center align-self-center'}>
               <h6 className={'mx-5'}><i>made by Edoardo Alberti s305922</i></h6>
            </Col>
         </Row>
      </>
   )
}

export default MainLayout
