import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap'
import { ApiService } from '../services/api'

const Hiring = () => {
  const [applicantName, setApplicantName] = useState<string>('')
  const [applicantEmail, setApplicantEmail] = useState<string>('')
  const [applicantPhone, setApplicantPhone] = useState<string>('')
  const [position, setPosition] = useState<string>('')
  const [experience, setExperience] = useState<string>('')
  const [coverLetter, setCoverLetter] = useState<string>('')
  const [resume, setResume] = useState<File | null>(null)
  const [showAlert, setShowAlert] = useState<boolean>(false)
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success')
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const positions = [
    'Técnica en Uñas',
    'Manicurista',
    'Pedicurista',
    'Terapeuta de Belleza',
    'Recepcionista',
    'Asistente de Salón',
    'Otro'
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResume(file)
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data:mime/type;base64, prefix
          const base64 = reader.result.split(',')[1]
          resolve(base64)
        } else {
          reject(new Error('Failed to convert file to base64'))
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Convert file to base64 if present
      let resumeFileContent = ''
      if (resume) {
        resumeFileContent = await convertFileToBase64(resume)
      }

      // Prepare application data
      const applicationData = {
        applicantName,
        applicantEmail,
        applicantPhone,
        position,
        experience,
        coverLetter,
        resumeFileName: resume?.name || '',
        resumeFileSize: resume?.size || 0,
        resumeFileContent
      }

      // Save to database
      await ApiService.createJobApplication(applicationData)
      
      // Show success message
      setAlertMessage('¡Aplicación enviada exitosamente! Revisaremos tu aplicación y te contactaremos pronto.')
      setAlertType('success')
      setShowAlert(true)
      
      // Reset form
      setApplicantName('')
      setApplicantEmail('')
      setApplicantPhone('')
      setPosition('')
      setExperience('')
      setCoverLetter('')
      setResume(null)
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
      
    } catch (error) {
      console.error('Error submitting application:', error)
      setAlertMessage('Error al enviar la aplicación. Por favor, inténtalo de nuevo.')
      setAlertType('danger')
      setShowAlert(true)
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setShowAlert(false), 8000)
    }
  }

  return (
    <section className="services-section" style={{ minHeight: '100vh' }}>
      <Container style={{ paddingTop: '120px', paddingBottom: '60px' }}>
      <Row>
        <Col lg={12} className="text-center mb-5">
          <h1 className="display-4 fw-bold">Únete a Nuestro Equipo</h1>
          <p className="lead text-muted">
            Siempre estamos buscando personas talentosas y apasionadas para unirse a la familia de Bennett Salon
          </p>
        </Col>
      </Row>

      {/* Job Opportunities Flyer */}
      <Row className="mb-5">
        <Col lg={6} className="mx-auto">
          <Card className="salon-card">
            <Card.Body className="p-0">
              <img 
                src="/images/hero/hiringflyer.jpg" 
                alt="Current Job Openings" 
                className="img-fluid rounded-4"
                style={{ width: '100%', height: 'auto' }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Application Form */}
      <Row>
        <Col lg={8} className="mx-auto">
          <Card className="salon-card">
            <Card.Body className="p-5">
              <h2 className="mb-4 text-center">Aplica Hoy</h2>
              
              {showAlert && (
                <Alert variant={alertType} className="mb-4">
                  {alertMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre Completo <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ingresa tu nombre completo"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Dirección de Email <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Ingresa tu email"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Número de Teléfono <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="tel"
                        placeholder="Ingresa tu número de teléfono"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Posición Solicitada <span className="text-danger">*</span></Form.Label>
                      <Form.Select 
                        value={position} 
                        onChange={(e) => setPosition(e.target.value)}
                        required
                      >
                        <option value="">Selecciona una posición...</option>
                        {positions.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Años de Experiencia</Form.Label>
                  <Form.Select 
                    value={experience} 
                    onChange={(e) => setExperience(e.target.value)}
                  >
                    <option value="">Selecciona nivel de experiencia...</option>
                    <option value="no-experience">Sin Experiencia (Nivel de Entrada)</option>
                    <option value="0-1">0-1 Años</option>
                    <option value="2-3">2-3 Años</option>
                    <option value="4-5">4-5 Años</option>
                    <option value="5+">5+ Años</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Subir Currículum/CV <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    required
                  />
                  <small className="text-muted">
                    Formatos aceptados: PDF, DOC, DOCX (Tamaño máx: 5MB)
                  </small>
                  {resume && (
                    <small className="text-success d-block">
                      ✓ Archivo seleccionado: {resume.name}
                    </small>
                  )}
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Carta de Presentación / ¿Por qué quieres trabajar con nosotras?</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    placeholder="Cuéntanos sobre ti, tu pasión por la belleza y por qué te gustaría unirte a nuestro equipo..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </Form.Group>

                <div className="text-center">
                  <Button 
                    type="submit" 
                    className="btn-primary" 
                    size="lg"
                    style={{ minWidth: '200px' }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Aplicación'
                    )}
                  </Button>
                </div>

                <small className="text-muted d-block mt-3 text-center">
                  * Campos requeridos. Revisaremos tu aplicación y contactaremos a candidatos calificados dentro de 1-2 semanas.
                </small>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Why Work With Us Section */}
      <Row className="mt-5">
        <Col lg={10} className="mx-auto">
          <Card className="salon-card">
            <Card.Body className="p-5">
              <h3 className="text-center mb-4">¿Por Qué Trabajar en Bennett Salon de Beauté?</h3>
              <Row>
                <Col md={6}>
                  <ul className="list-unstyled">
                    <li className="mb-2">✨ <strong>Crecimiento Profesional:</strong> Entrenamiento y desarrollo continuo</li>
                    <li className="mb-2">🤝 <strong>Equipo de Apoyo:</strong> Trabaja con profesionales apasionadas</li>
                    <li className="mb-2">💼 <strong>Horario Flexible:</strong> Prioridad en balance vida-trabajo</li>
                    <li className="mb-0">🎯 <strong>Avance Profesional:</strong> Oportunidades de crecer dentro de la empresa</li>
                  </ul>
                </Col>
                <Col md={6}>
                  <ul className="list-unstyled">
                    <li className="mb-2">💡 <strong>Libertad Creativa:</strong> Expresa tus talentos artísticos</li>
                    <li className="mb-2">🏆 <strong>Pago Competitivo:</strong> Paquetes de compensación justa</li>
                    <li className="mb-2">👥 <strong>Ambiente Positivo:</strong> Lugar de trabajo amigable y acogedor</li>
                    <li className="mb-0">📚 <strong>Oportunidades de Aprendizaje:</strong> Mantente al día con las últimas tendencias</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Container>
    </section>
  )
}

export default Hiring