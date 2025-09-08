import React from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

const Navigation: React.FC = () => {
  return (
    <Navbar expand="lg" fixed="top" className="modern-navbar">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand className="modern-brand">
            <div className="brand-icon">💅</div>
            <div className="brand-text">
              <span className="brand-main">Bennett</span>
              <span className="brand-sub">Salon de Beauté</span>
            </div>
          </Navbar.Brand>
        </LinkContainer>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="modern-toggler">
          <span className="toggler-line"></span>
          <span className="toggler-line"></span>
          <span className="toggler-line"></span>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-pills">
            <LinkContainer to="/">
              <Nav.Link className="nav-pill">
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Inicio</span>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link className="nav-pill">
                <span className="nav-icon">ℹ️</span>
                <span className="nav-text">Acerca</span>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/booking">
              <Nav.Link className="nav-pill nav-pill-primary">
                <span className="nav-icon">📅</span>
                <span className="nav-text">Reservar</span>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/gallery">
              <Nav.Link className="nav-pill">
                <span className="nav-icon">🖼️</span>
                <span className="nav-text">Galería</span>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/testimonials">
              <Nav.Link className="nav-pill">
                <span className="nav-icon">⭐</span>
                <span className="nav-text">Testimonios</span>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/hiring">
              <Nav.Link className="nav-pill">
                <span className="nav-icon">💼</span>
                <span className="nav-text">Empleos</span>
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation