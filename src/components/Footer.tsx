import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const Footer: React.FC = () => {
  return (
    <footer className="footer mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h5 className="mb-3">💅 Bennett Salon de Beauté</h5>
            <p className="mb-3">Servicios profesionales de belleza con un toque personal en Puerto Rico.</p>
            <p className="mb-0">
              <i className="fas fa-map-marker-alt me-2"></i>
              📍 Puerto Rico
            </p>
          </Col>
          <Col md={4} className="text-center">
            <h5 className="mb-3">🌐 Síguenos en Redes</h5>
            <div className="d-flex justify-content-center gap-3 mb-3">
              <a href="https://instagram.com/bennettsalondebeaute" target="_blank" className="text-white">
                <i className="fab fa-instagram" style={{fontSize: '2rem'}}></i>
              </a>
              <a href="https://facebook.com/bennettsalondebeaute" target="_blank" className="text-white">
                <i className="fab fa-facebook" style={{fontSize: '2rem'}}></i>
              </a>
            </div>
            <p className="mb-0">@bennettsalondebeaute</p>
          </Col>
          <Col md={4} className="text-md-end">
            <h5 className="mb-3">📞 Contáctanos</h5>
            <p className="mb-2">
              <i className="fab fa-instagram me-2"></i>
              Instagram: @bennettsalondebeaute
            </p>
            <p className="mb-2">
              <i className="fab fa-facebook me-2"></i>
              Facebook: Bennett Salon
            </p>
            <p className="mb-0">
              <i className="fas fa-calendar-check me-2"></i>
              Reserva por DM o en línea
            </p>
          </Col>
        </Row>
        <hr className="my-4" />
        <Row>
          <Col className="text-center">
            <p className="mb-2">
              <strong>🇵🇷 Orgullosamente sirviendo a Puerto Rico 🇵🇷</strong>
            </p>
            <p className="mb-0">&copy; {new Date().getFullYear()} Bennett Salon de Beauté. Todos los derechos reservados.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer