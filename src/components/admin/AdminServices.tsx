import React, { useState } from 'react'
import { Row, Col, Card, Button, Modal, Form, Alert, Badge, Table } from 'react-bootstrap'
import { useAdmin, Service } from '../../contexts/AdminContextNew'

const AdminServices = () => {
  const { services, addService, updateService, deleteService } = useAdmin()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success')
  
  const [newService, setNewService] = useState({
    name: '',
    category: 'Manicura' as Service['category'],
    isActive: true
  })

  const [editService, setEditService] = useState({
    name: '',
    category: 'Manicura' as Service['category'],
    isActive: true
  })

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addService(newService)
      setShowAddModal(false)
      setNewService({ name: '', category: 'Manicura', isActive: true })
      setAlertMessage('Servicio agregado exitosamente')
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    } catch (error) {
      setAlertMessage('Error al agregar el servicio')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService) return
    
    try {
      await updateService(selectedService.id, editService)
      setShowEditModal(false)
      setSelectedService(null)
      setAlertMessage('Servicio actualizado exitosamente')
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    } catch (error) {
      setAlertMessage('Error al actualizar el servicio')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const handleDeleteService = async () => {
    if (!selectedService) return
    
    try {
      await deleteService(selectedService.id)
      setShowDeleteModal(false)
      setSelectedService(null)
      setAlertMessage('Servicio eliminado exitosamente')
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    } catch (error) {
      setAlertMessage('Error al eliminar el servicio')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const openEditModal = (service: Service) => {
    setSelectedService(service)
    setEditService({
      name: service.name,
      category: service.category,
      isActive: service.isActive
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (service: Service) => {
    setSelectedService(service)
    setShowDeleteModal(true)
  }

  const toggleServiceStatus = async (service: Service) => {
    try {
      await updateService(service.id, { isActive: !service.isActive })
      setAlertMessage(`Servicio ${service.isActive ? 'desactivado' : 'activado'} exitosamente`)
      setAlertType('success')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    } catch (error) {
      setAlertMessage('Error al cambiar el estado del servicio')
      setAlertType('danger')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const getCategoryBadge = (category: Service['category']) => {
    const colors = {
      'Manicura': 'primary',
      'Pedicura': 'success',
      'Especial': 'warning',
      'Combo': 'info'
    }
    return <Badge bg={colors[category]}>{category}</Badge>
  }

  const getStatusBadge = (isActive: boolean) => {
    return <Badge bg={isActive ? 'success' : 'secondary'}>{isActive ? 'Activo' : 'Inactivo'}</Badge>
  }

  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = []
    }
    acc[service.category].push(service)
    return acc
  }, {} as Record<Service['category'], Service[]>)

  return (
    <>
      {showAlert && (
        <Alert variant={alertType} className="mb-4">
          {alertMessage}
        </Alert>
      )}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card style={{ 
            background: 'rgba(13, 110, 253, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(13, 110, 253, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(13, 110, 253, 0.2)',
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ fontSize: '3rem' }} className="mb-3">💅</div>
              <h2 style={{ color: '#0d6efd', fontWeight: '700' }}>
                {servicesByCategory['Manicura']?.length || 0}
              </h2>
              <p style={{ margin: 0, fontWeight: '600', color: '#666' }}>Servicios de Manicura</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card style={{ 
            background: 'rgba(25, 135, 84, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(25, 135, 84, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(25, 135, 84, 0.2)',
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ fontSize: '3rem' }} className="mb-3">🦶</div>
              <h2 style={{ color: '#198754', fontWeight: '700' }}>
                {servicesByCategory['Pedicura']?.length || 0}
              </h2>
              <p style={{ margin: 0, fontWeight: '600', color: '#666' }}>Servicios de Pedicura</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card style={{ 
            background: 'rgba(255, 193, 7, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 193, 7, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(255, 193, 7, 0.2)',
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ fontSize: '3rem' }} className="mb-3">⭐</div>
              <h2 style={{ color: '#ffc107', fontWeight: '700' }}>
                {servicesByCategory['Especial']?.length || 0}
              </h2>
              <p style={{ margin: 0, fontWeight: '600', color: '#666' }}>Servicios Especiales</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card style={{ 
            background: 'rgba(13, 202, 240, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(13, 202, 240, 0.3)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(13, 202, 240, 0.2)',
          }} className="text-center h-100">
            <Card.Body className="p-4">
              <div style={{ fontSize: '3rem' }} className="mb-3">🎁</div>
              <h2 style={{ color: '#0dcaf0', fontWeight: '700' }}>
                {servicesByCategory['Combo']?.length || 0}
              </h2>
              <p style={{ margin: 0, fontWeight: '600', color: '#666' }}>Combos</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Services Table */}
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
            } as React.CSSProperties}>🛍️ Gestión de Servicios</h4>
            <Button 
              onClick={() => setShowAddModal(true)}
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
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)'
                ;(e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)'
                ;(e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
            >
              ➕ Agregar Servicio
            </Button>
          </div>
        </Card.Header>
        <Card.Body style={{ padding: '32px' }}>
          {services.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem' }} className="mb-3">🛍️</div>
              <h5>No hay servicios configurados</h5>
              <p className="text-muted">Agrega servicios para que aparezcan en el formulario de reservas.</p>
            </div>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Nombre del Servicio</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                  <th>Fecha de Creación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <strong>{service.name}</strong>
                    </td>
                    <td>{getCategoryBadge(service.category)}</td>
                    <td>{getStatusBadge(service.isActive)}</td>
                    <td>
                      <small className="text-muted">
                        {service.createdAt.toLocaleDateString('es-PR')}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => toggleServiceStatus(service)}
                          style={{
                            background: service.isActive 
                              ? 'linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)'
                              : 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontWeight: '600',
                            fontSize: '0.75rem',
                            color: 'white',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {service.isActive ? '⏸️' : '▶️'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openEditModal(service)}
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
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => openDeleteModal(service)}
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

      {/* Add Service Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '12px 12px 0 0',
          color: 'white'
        }}>
          <Modal.Title style={{ fontWeight: '700', color: 'white' }}>
            ➕ Agregar Nuevo Servicio
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddService}>
          <Modal.Body style={{ padding: '32px' }}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Servicio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Manicura Francesa"
                value={newService.name}
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={newService.category}
                onChange={(e) => setNewService({ ...newService, category: e.target.value as Service['category'] })}
                required
              >
                <option value="Manicura">Manicura</option>
                <option value="Pedicura">Pedicura</option>
                <option value="Especial">Especial</option>
                <option value="Combo">Combo</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Servicio activo (visible para clientes)"
                checked={newService.isActive}
                onChange={(e) => setNewService({ ...newService, isActive: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ border: 'none', padding: '24px 32px' }}>
            <Button 
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{
                background: 'rgba(108, 117, 125, 0.1)',
                border: '1px solid rgba(108, 117, 125, 0.3)',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: '600',
                color: '#6c757d'
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
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
              ➕ Agregar Servicio
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Service Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '12px 12px 0 0',
          color: 'white'
        }}>
          <Modal.Title style={{ fontWeight: '700', color: 'white' }}>
            ✏️ Editar Servicio
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditService}>
          <Modal.Body style={{ padding: '32px' }}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Servicio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Manicura Francesa"
                value={editService.name}
                onChange={(e) => setEditService({ ...editService, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={editService.category}
                onChange={(e) => setEditService({ ...editService, category: e.target.value as Service['category'] })}
                required
              >
                <option value="Manicura">Manicura</option>
                <option value="Pedicura">Pedicura</option>
                <option value="Especial">Especial</option>
                <option value="Combo">Combo</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Servicio activo (visible para clientes)"
                checked={editService.isActive}
                onChange={(e) => setEditService({ ...editService, isActive: e.target.checked })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer style={{ border: 'none', padding: '24px 32px' }}>
            <Button 
              type="button"
              onClick={() => setShowEditModal(false)}
              style={{
                background: 'rgba(108, 117, 125, 0.1)',
                border: '1px solid rgba(108, 117, 125, 0.3)',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: '600',
                color: '#6c757d'
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontWeight: '600',
                color: 'white',
                boxShadow: '0 4px 15px rgba(255, 193, 7, 0.3)'
              }}
            >
              💾 Guardar Cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Service Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton style={{ 
          background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
          border: 'none',
          borderRadius: '12px 12px 0 0',
          color: 'white'
        }}>
          <Modal.Title style={{ fontWeight: '700', color: 'white' }}>
            🗑️ Eliminar Servicio
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '32px' }}>
          <div className="text-center">
            <div style={{ fontSize: '4rem' }} className="mb-3">⚠️</div>
            <h5>¿Estás segura de que quieres eliminar este servicio?</h5>
            {selectedService && (
              <p className="text-muted mb-4">
                <strong>"{selectedService.name}"</strong> será eliminado permanentemente.
                Esta acción no se puede deshacer.
              </p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer style={{ border: 'none', padding: '24px 32px' }}>
          <Button 
            onClick={() => setShowDeleteModal(false)}
            style={{
              background: 'rgba(108, 117, 125, 0.1)',
              border: '1px solid rgba(108, 117, 125, 0.3)',
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: '600',
              color: '#6c757d'
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteService}
            style={{
              background: 'linear-gradient(135deg, #dc3545 0%, #e83e8c 100%)',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: '600',
              color: 'white',
              boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
            }}
          >
            🗑️ Eliminar Definitivamente
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminServices