import React from "react";
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  MenuItem,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
export const MyNavBar = ({ ...props }) => {

  return (
    <Navbar inverse fluid collapseOnSelect style={{boxShadow: '2px 2px 10px black'}}>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">Canvas Home</a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          {/* <NavDropdown title={'Sensors'} id='dd' eventKey={7} style={showHideTech}>
            <LinkContainer to="/sensors">
                <NavItem eventKey={7.1}>Information</NavItem>
            </LinkContainer>
          </NavDropdown> */}
          <LinkContainer to="/explosion">
            <NavItem eventKey={1}  > Explosion </NavItem>
          </LinkContainer>
          <LinkContainer to="/math">
            <NavItem eventKey={1}  > Volcano and Fireworks </NavItem>
          </LinkContainer>
          <LinkContainer to="/kinematics">
            <NavItem eventKey={1}  > Kinematics </NavItem>
          </LinkContainer>
          <LinkContainer to="/transform">
            <NavItem eventKey={1}  > Transformations </NavItem>
          </LinkContainer>
          <LinkContainer to="/rotation">
            <NavItem eventKey={1}  > Rotation </NavItem>
          </LinkContainer>
          <LinkContainer to="/forrest">
            <NavItem eventKey={1}  > The Forest </NavItem>
          </LinkContainer>
          <LinkContainer to="/game">
            <NavItem eventKey={1}  > Game of Life </NavItem>
          </LinkContainer>
          <LinkContainer to="/connect">
            <NavItem eventKey={1}  > Flock Off </NavItem>
          </LinkContainer>
        </Nav>
        <Navbar.Text pullRight style={{ fontSize: '12px', marginRight: '10px' }}>
          {'BlackToque ©'}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}

//
/**
 * pure: false option in the connect method is required to let the navbar know the react router has changed routes
 * Basically, the default (true) runs a componentShouldUpdate test, and unless something it is relying on in state
 * has changed, it won't update. Setting it to false will allow it to update and pick up the new route, and hightlight
 * the active link/tab
 */
export default {MyNavBar }
