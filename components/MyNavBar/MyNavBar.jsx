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
    <Navbar inverse fluid collapseOnSelect style={{boxShadow: '2px 2px 10px black', width: '80%'}}>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="/">Canvas Home </a>
        </Navbar.Brand>
        <Navbar.Toggle />
      </Navbar.Header>
      <Navbar.Collapse>
        <Nav>
          <LinkContainer to="/explosion">
            <NavItem eventKey={1}  > Explosion </NavItem>
          </LinkContainer>
          <LinkContainer to="/math">
            <NavItem eventKey={2}  > Volcano and Fireworks </NavItem>
          </LinkContainer>
          <LinkContainer to="/kinematics">
            <NavItem eventKey={3}  > Kinematics </NavItem>
          </LinkContainer>
          <LinkContainer to="/transform">
            <NavItem eventKey={4}  > Transformations </NavItem>
          </LinkContainer>
          <LinkContainer to="/rotation">
            <NavItem eventKey={5}  > Rotation </NavItem>
          </LinkContainer>
          <LinkContainer to="/forrest">
            <NavItem eventKey={6}  > The Forest </NavItem>
          </LinkContainer>
          <LinkContainer to="/game">
            <NavItem eventKey={7}  > Game of Life </NavItem>
          </LinkContainer>
          <LinkContainer to="/connect">
            <NavItem eventKey={8}  > Flock Off </NavItem>
          </LinkContainer>
          <LinkContainer to="/mathart">
            <NavItem eventKey={9}  > Math Art </NavItem>
          </LinkContainer>
          <LinkContainer to="/fluid">
            <NavItem eventKey={10}  > Fluid Simulator </NavItem>
          </LinkContainer>
          {/* <LinkContainer to="/world">
            <NavItem eventKey={9}  > World </NavItem>
          </LinkContainer> */}
        </Nav>
        <Navbar.Text pullRight style={{ fontSize: '12px', marginRight: '10px' }}>
          {'BlackToque ©'}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default {MyNavBar }
