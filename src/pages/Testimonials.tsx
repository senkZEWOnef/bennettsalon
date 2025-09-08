import { Container, Row, Col, Card } from 'react-bootstrap'

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sara Jiménez",
      service: "Manicura en Gel",
      rating: 5,
      text: "¡Servicio absolutamente increíble! La atención al detalle es impresionante y mis uñas nunca se han visto mejor. Bennett es muy profesional y te hace sentir muy cómoda.",
      date: "hace 2 semanas"
    },
    {
      id: 2,
      name: "María Rodríguez",
      service: "Pedicura Spa",
      rating: 5,
      text: "He estado viniendo aquí por meses y nunca me decepciona. La pedicura spa es muy relajante y mis pies se sienten fantásticos después. ¡Altamente recomendado!",
      date: "hace 1 mes"
    },
    {
      id: 3,
      name: "Jennifer López",
      service: "Combo Manicura y Pedicura",
      rating: 5,
      text: "¡La mejor experiencia de salón que he tenido! El paquete combo tiene excelente valor y los resultados siempre son perfectos. El ambiente es muy acogedor y limpio.",
      date: "hace 3 semanas"
    },
    {
      id: 4,
      name: "Ashley Morales",
      service: "Manicura Clásica",
      rating: 5,
      text: "¡Bennett tiene un ojo artístico increible! Siempre sabe exactamente lo que se verá mejor y confío en ella completamente. La manicura clásica es mi favorita y siempre queda impecable.",
      date: "hace 1 semana"
    },
    {
      id: 5,
      name: "Lisa Torres",
      service: "Tratamiento Especial",
      rating: 5,
      text: "¡Los tratamientos especiales aquí son increíbles! Me hice un diseño de arte en uñas que ha recibido tantos cumplidos. La creatividad y nivel de habilidad es excepcional.",
      date: "hace 2 meses"
    },
    {
      id: 6,
      name: "Michelle Díaz",
      service: "Pedicura Clásica",
      rating: 5,
      text: "¡Una experiencia fantástica cada vez! La pedicura es completa y relajante, y mis uñas siempre se ven perfectas por semanas. El proceso de reserva es muy fácil también.",
      date: "hace 3 semanas"
    }
  ]

  const renderStars = (rating: number) => {
    return Array(rating).fill(0).map((_, i) => (
      <span key={i} className="text-warning">★</span>
    ))
  }

  return (
    <Container style={{ paddingTop: '120px', paddingBottom: '60px' }}>
      <Row>
        <Col lg={12} className="text-center mb-5">
          <h1 className="display-4 fw-bold">Lo Que Dicen Nuestras Clientas</h1>
          <p className="lead text-muted">
            No solo confíes en nuestra palabra - escucha de nuestras clientas satisfechas sobre sus experiencias.
          </p>
        </Col>
      </Row>

      <Row>
        {testimonials.map((testimonial) => (
          <Col md={6} lg={4} key={testimonial.id} className="mb-4">
            <Card className="salon-card h-100">
              <Card.Body className="d-flex flex-column">
                <div className="mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <Card.Text className="flex-grow-1 mb-3">
                  "{testimonial.text}"
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-0 fw-bold">{testimonial.name}</h6>
                      <small className="text-muted">{testimonial.service}</small>
                    </div>
                    <small className="text-muted">{testimonial.date}</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col lg={8} className="mx-auto text-center">
          <Card className="salon-card">
            <Card.Body className="p-5">
              <h3 className="mb-3">Comparte Tu Experiencia</h3>
              <p className="text-muted mb-4">
                ¿Tuviste una gran experiencia con nosotras? ¡Nos encantaría escuchar de ti! 
                Tus comentarios nos ayudan a continuar brindando el mejor servicio posible.
              </p>
              <p className="mb-0">
                <strong>Déjanos una reseña en Instagram:</strong> @bennettsalondebeaute
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Testimonials