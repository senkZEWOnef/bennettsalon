import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Badge, Button, Table, Modal, Form, Alert } from 'react-bootstrap'
import { ApiService } from '../../services/api'

interface JobApplication {
  id: string
  applicantName: string
  applicantEmail: string
  applicantPhone: string
  position: string
  experience: string
  coverLetter: string
  resumeFileName: string
  resumeFileSize: number
  resumeFileContent?: string // Base64 encoded file content
  status: 'pending' | 'reviewed' | 'contacted' | 'hired' | 'rejected'
  notes: string
  createdAt: Date
  reviewedAt: Date | null
}

interface JobApplicationStats {
  total: number
  pending: number
  reviewed: number
  contacted: number
  hired: number
  rejected: number
}

const AdminJobApplications = () => {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [stats, setStats] = useState<JobApplicationStats>({
    total: 0,
    pending: 0,
    reviewed: 0,
    contacted: 0,
    hired: 0,
    rejected: 0
  })
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success')
  const [notes, setNotes] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<JobApplication['status']>('pending')
  const [loading, setLoading] = useState(true)

  // Load applications and stats
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [applicationsData, statsData] = await Promise.all([
        ApiService.getJobApplications(),
        ApiService.getJobApplicationStats()
      ])
      setApplications(applicationsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading job applications:', error)
      setAlertMessage('Error al cargar las aplicaciones')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: JobApplication['status']) => {
    const variants = {
      pending: { bg: 'warning', text: 'Pendiente' },
      reviewed: { bg: 'info', text: 'Revisada' },
      contacted: { bg: 'primary', text: 'Contactada' },
      hired: { bg: 'success', text: 'Contratada' },
      rejected: { bg: 'danger', text: 'Rechazada' }
    }
    const variant = variants[status]
    return <Badge bg={variant.bg}>{variant.text}</Badge>
  }

  const openApplicationModal = (application: JobApplication) => {
    setSelectedApplication(application)
    setSelectedStatus(application.status)
    setNotes(application.notes)
    setShowModal(true)
  }

  const handleStatusUpdate = async () => {
    if (!selectedApplication) return

    try {
      await ApiService.updateJobApplicationStatus(selectedApplication.id, selectedStatus, notes)
      setShowModal(false)
      setAlertMessage('Estado actualizado exitosamente')
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      loadData() // Reload data
    } catch (error) {
      setAlertMessage('Error al actualizar el estado')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás segura de que quieres eliminar esta aplicación?')) return

    try {
      await ApiService.deleteJobApplication(id)
      setAlertMessage('Aplicación eliminada exitosamente')
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      loadData() // Reload data
    } catch (error) {
      setAlertMessage('Error al eliminar la aplicación')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-PR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const downloadResume = (application: JobApplication) => {
    if (!application.resumeFileContent || !application.resumeFileName) {
      setAlertMessage('El archivo CV no está disponible para descarga')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
      return
    }

    try {
      // Convert base64 to blob
      const byteCharacters = atob(application.resumeFileContent)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      
      // Determine MIME type based on file extension
      const extension = application.resumeFileName.split('.').pop()?.toLowerCase()
      let mimeType = 'application/octet-stream'
      
      switch (extension) {
        case 'pdf':
          mimeType = 'application/pdf'
          break
        case 'doc':
          mimeType = 'application/msword'
          break
        case 'docx':
          mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          break
        case 'txt':
          mimeType = 'text/plain'
          break
      }
      
      const blob = new Blob([byteArray], { type: mimeType })
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = application.resumeFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      setAlertMessage('CV descargado exitosamente')
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    } catch (error) {
      console.error('Error downloading resume:', error)
      setAlertMessage('Error al descargar el CV')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 5000)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      {showAlert && (
        <Alert variant={alertType} className="mb-4">
          {alertMessage}
        </Alert>
      )}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={2} className="mb-3">
          <Card style={{ 
            background: 'rgba(13, 110, 253, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(13, 110, 253, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(13, 110, 253, 0.2)',
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ fontSize: '2.5rem' }} className="mb-3">📋</div>
              <h3 style={{ color: '#0d6efd', fontWeight: '700' }}>{stats.total}</h3>
              <p style={{ margin: 0, fontWeight: '600', color: '#666', fontSize: '0.9rem' }}>Total</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="mb-3">
          <Card style={{ 
            background: 'rgba(255, 193, 7, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(255, 193, 7, 0.2)',
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ fontSize: '2.5rem' }} className="mb-3">⏳</div>
              <h3 style={{ color: '#ffc107', fontWeight: '700' }}>{stats.pending}</h3>
              <p style={{ margin: 0, fontWeight: '600', color: '#666', fontSize: '0.9rem' }}>Pendientes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="mb-3">
          <Card style={{ 
            background: 'rgba(13, 202, 240, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(13, 202, 240, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(13, 202, 240, 0.2)',
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ fontSize: '2.5rem' }} className="mb-3">👀</div>
              <h3 style={{ color: '#0dcaf0', fontWeight: '700' }}>{stats.reviewed}</h3>
              <p style={{ margin: 0, fontWeight: '600', color: '#666', fontSize: '0.9rem' }}>Revisadas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="mb-3">
          <Card style={{ 
            background: 'rgba(102, 126, 234, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.2)',
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ fontSize: '2.5rem' }} className="mb-3">📞</div>
              <h3 style={{ color: '#667eea', fontWeight: '700' }}>{stats.contacted}</h3>
              <p style={{ margin: 0, fontWeight: '600', color: '#666', fontSize: '0.9rem' }}>Contactadas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="mb-3">
          <Card style={{ 
            background: 'rgba(25, 135, 84, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(25, 135, 84, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(25, 135, 84, 0.2)',
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ fontSize: '2.5rem' }} className="mb-3">✅</div>
              <h3 style={{ color: '#198754', fontWeight: '700' }}>{stats.hired}</h3>
              <p style={{ margin: 0, fontWeight: '600', color: '#666', fontSize: '0.9rem' }}>Contratadas</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="mb-3">
          <Card style={{ 
            background: 'rgba(220, 53, 69, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(220, 53, 69, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(220, 53, 69, 0.2)',
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ fontSize: '2.5rem' }} className="mb-3">❌</div>
              <h3 style={{ color: '#dc3545', fontWeight: '700' }}>{stats.rejected}</h3>
              <p style={{ margin: 0, fontWeight: '600', color: '#666', fontSize: '0.9rem' }}>Rechazadas</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Applications Table */}
      <Card style={{ 
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Card.Header style={{ 
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          borderRadius: '20px 20px 0 0',
          padding: '24px 32px'
        }}>
          <div className="d-flex justify-content-between align-items-center">
            <h4 style={{ 
              margin: 0,
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            } as React.CSSProperties}>💼 Aplicaciones de Trabajo</h4>
            <Button 
              onClick={loadData}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: 'white',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              🔄 Actualizar
            </Button>
          </div>
        </Card.Header>
        <Card.Body style={{ padding: '32px' }}>
          {applications.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }} className="mb-3">💼</div>
              <h5>No hay aplicaciones de trabajo</h5>
              <p className="text-muted">Las aplicaciones aparecerán aquí cuando los candidatos envíen sus solicitudes.</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th>Posición</th>
                  <th>Experiencia</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td>
                      <div>
                        <strong>{application.applicantName}</strong>
                        <br />
                        <small className="text-muted">{application.applicantEmail}</small>
                        <br />
                        <small className="text-muted">{application.applicantPhone}</small>
                      </div>
                    </td>
                    <td>
                      <strong>{application.position}</strong>
                    </td>
                    <td>
                      {application.experience || 'No especificada'}
                    </td>
                    <td>{getStatusBadge(application.status)}</td>
                    <td>
                      <small className="text-muted">
                        {formatDate(application.createdAt)}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => openApplicationModal(application)}
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontWeight: '600',
                            fontSize: '0.75rem',
                            color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          👁️ Ver
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleDelete(application.id)}
                          style={{
                            background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontWeight: '600',
                            fontSize: '0.75rem',
                            color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Application Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '12px 12px 0 0',
          color: 'white'
        }}>
          <Modal.Title style={{ fontWeight: '700', color: 'white' }}>
            💼 Detalles de Aplicación - {selectedApplication?.applicantName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '32px' }}>
          {selectedApplication && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6 style={{ fontWeight: '700', color: '#667eea' }}>Información Personal</h6>
                  <p><strong>Nombre:</strong> {selectedApplication.applicantName}</p>
                  <p><strong>Email:</strong> {selectedApplication.applicantEmail}</p>
                  <p><strong>Teléfono:</strong> {selectedApplication.applicantPhone}</p>
                  <p><strong>Posición:</strong> {selectedApplication.position}</p>
                  <p><strong>Experiencia:</strong> {selectedApplication.experience || 'No especificada'}</p>
                </Col>
                <Col md={6}>
                  <h6 style={{ fontWeight: '700', color: '#667eea' }}>Detalles de Aplicación</h6>
                  <p><strong>Estado:</strong> {getStatusBadge(selectedApplication.status)}</p>
                  <p><strong>Aplicó:</strong> {formatDate(selectedApplication.createdAt)}</p>
                  {selectedApplication.reviewedAt && (
                    <p><strong>Revisada:</strong> {formatDate(selectedApplication.reviewedAt)}</p>
                  )}
                  {selectedApplication.resumeFileName && (
                    <div>
                      <p style={{ marginBottom: '8px' }}>
                        <strong>CV:</strong> {selectedApplication.resumeFileName} ({formatFileSize(selectedApplication.resumeFileSize)})
                      </p>
                      {selectedApplication.resumeFileContent ? (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => downloadResume(selectedApplication)}
                          style={{
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontWeight: '500',
                            fontSize: '0.8rem'
                          }}
                        >
                          📄 Descargar CV
                        </Button>
                      ) : (
                        <small className="text-muted">
                          <em>Archivo no disponible para descarga</em>
                        </small>
                      )}
                    </div>
                  )}
                </Col>
              </Row>

              {selectedApplication.coverLetter && (
                <div className="mb-4">
                  <h6 style={{ fontWeight: '700', color: '#667eea' }}>Carta de Presentación</h6>
                  <div style={{
                    background: 'rgba(102, 126, 234, 0.05)',
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    borderRadius: '12px',
                    padding: '16px'
                  }}>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{selectedApplication.coverLetter}</p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <h6 style={{ fontWeight: '700', color: '#667eea' }}>Actualizar Estado</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Nuevo Estado</Form.Label>
                  <Form.Select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as JobApplication['status'])}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="reviewed">Revisada</option>
                    <option value="contacted">Contactada</option>
                    <option value="hired">Contratada</option>
                    <option value="rejected">Rechazada</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Notas Administrativas</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Agrega notas sobre esta aplicación..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Form.Group>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', padding: '24px 32px' }}>
          <Button 
            onClick={() => setShowModal(false)}
            style={{
              background: 'rgba(108, 117, 125, 0.1)',
              border: '1px solid rgba(108, 117, 125, 0.3)',
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: '600',
              color: '#6c757d'
            }}
          >
            Cerrar
          </Button>
          <Button 
            onClick={handleStatusUpdate}
            style={{
              background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: '600',
              color: 'white',
              boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
            }}
          >
            💾 Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminJobApplications