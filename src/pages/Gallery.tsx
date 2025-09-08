import { Container, Row, Col, Card } from 'react-bootstrap'

const Gallery = () => {
  const galleryImages = [
    // Manicuras
    { id: 1, src: '/images/gallery/manicures/manicure2.jpg', title: 'Diseño Elegante de Manicura', category: 'Manicura' },
    { id: 2, src: '/images/gallery/manicures/manicure3.jpg', title: 'Arte Creativo en Uñas', category: 'Manicura' },
    { id: 3, src: '/images/gallery/manicures/manicure4.jpg', title: 'Acabado Profesional', category: 'Manicura' },
    { id: 4, src: '/images/gallery/manicures/manicure5.jpg', title: 'Combinación de Colores Elegante', category: 'Manicura' },
    { id: 5, src: '/images/gallery/manicures/manicureclassic.jpg', title: 'Manicura Francesa Clásica', category: 'Manicura' },
    { id: 6, src: '/images/gallery/manicures/manicureengaged.jpg', title: 'Diseño para Ocasión Especial', category: 'Manicura' },
    { id: 7, src: '/images/gallery/manicures/manicurefresh.jpg', title: 'Look Fresco de Verano', category: 'Manicura' },
    // Pedicuras  
    { id: 8, src: '/images/gallery/pedicures/pedicure-classic.JPG', title: 'Pedicura Clásica', category: 'Pedicura' },
    { id: 9, src: '/images/gallery/pedicures/pedicure.JPG', title: 'Pedicura Profesional', category: 'Pedicura' },
    { id: 10, src: '/images/gallery/pedicures/pedicureRed.JPG', title: 'Pedicura Roja Vibrante', category: 'Pedicura' }
  ]

  return (
    <Container style={{ paddingTop: '120px', paddingBottom: '60px' }}>
      <Row>
        <Col lg={12} className="text-center mb-5">
          <h1 className="display-4 fw-bold">Nuestra Galería de Trabajos</h1>
          <p className="lead text-muted">
            Explora nuestros trabajos recientes y observa los hermosos resultados que creamos para nuestras clientas.
          </p>
        </Col>
      </Row>

      <Row>
        {galleryImages.map((image) => (
          <Col md={4} key={image.id} className="mb-4">
            <Card className="salon-card h-100">
              <div style={{ height: '250px', overflow: 'hidden', borderRadius: '15px 15px 0 0' }}>
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <Card.Body>
                <Card.Title>{image.title}</Card.Title>
                <Card.Text>
                  <span className={`badge ${image.category === 'Manicura' ? 'bg-primary' : 'bg-secondary'}`}>
                    {image.category}
                  </span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mt-5">
        <Col lg={8} className="mx-auto text-center">
          <div className="bg-light rounded-4 p-5">
            <h3 className="mb-3">¿Lista para Añadir Más Fotos?</h3>
            <p className="text-muted mb-0">
              Esta galería está lista para mostrar más de tus hermosos trabajos. 
              ¡Solo avísame cuando quieras subir más fotos y te ayudo a añadirlas para mostrar tus increíbles resultados!
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Gallery