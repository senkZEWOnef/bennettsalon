import { Container, Row, Col, Card } from 'react-bootstrap'
import { useEffect } from 'react'
import { useAdmin } from '../contexts/AdminContext'

const Gallery = () => {
  const { galleryImages } = useAdmin()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
          <Col sm={6} md={4} lg={3} key={image.id} className="mb-4">
            <Card className="salon-card h-100">
              <div style={{ height: '250px', overflow: 'hidden', borderRadius: '15px 15px 0 0' }}>
                <img 
                  src={image.src} 
                  alt={image.title}
                  className="w-100 h-100"
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBObyBEaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K'
                  }}
                />
              </div>
              <Card.Body>
                <Card.Title>{image.title}</Card.Title>
                <Card.Text>
                  <span className={`badge ${image.category === 'Manicura' ? 'bg-primary' : image.category === 'Pedicura' ? 'bg-secondary' : 'bg-warning'}`}>
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