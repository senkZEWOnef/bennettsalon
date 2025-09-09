import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Navigation: React.FC = () => {
  return (
    <Navbar expand="lg" fixed="top" className="sleek-navbar">
      <div className="w-100 d-flex align-items-center px-4">
        <LinkContainer to="/">
          <Navbar.Brand className="sleek-brand me-auto">
            <span className="brand-bennett">Bennett</span>
            <span className="brand-salon">Salon de Beauté</span>
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="sleek-toggler ms-auto">
          <span></span>
          <span></span>
          <span></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="sleek-nav">
            <LinkContainer to="/booking">
              <Nav.Link className="sleek-link">
                Reservar
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link className="sleek-link">
                Reglas
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/hiring">
              <Nav.Link className="sleek-link">
                Empleos
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin/login">
              <Nav.Link className="sleek-admin" title="Admin">
                ⚙️
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  )
}

export default Navigation