import React, { useState } from 'react'
import { Row, Col, Card, Button, Modal, Form, Alert, Badge } from 'react-bootstrap'
import { useAdmin, GalleryImage } from '../../contexts/AdminContextNew'

const AdminGallery = () => {
  const { galleryImages, addGalleryImage, removeGalleryImage, resetGalleryToDefaults } = useAdmin()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [newImage, setNewImage] = useState({
    src: '',
    title: '',
    category: 'Manicura' as 'Manicura' | 'Pedicura' | 'Especial'
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setAlertMessage('Por favor selecciona una imagen válida (JPG, PNG, WebP)')
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setAlertMessage('La imagen debe ser menor a 5MB')
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 3000)
        return
      }

      setSelectedFile(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewImage(prev => ({...prev, src: e.target?.result as string}))
      }
      reader.readAsDataURL(file)
    }
  }

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile || !newImage.title) {
      setAlertMessage('Por favor, selecciona una imagen y añade un título.')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
      return
    }

    setIsUploading(true)
    
    try {
      // Convert file to base64 for local storage
      const base64String = await convertFileToBase64(selectedFile)
      
      // Add image with base64 data
      addGalleryImage({
        src: base64String,
        title: newImage.title,
        category: newImage.category
      })
      
      // Reset form
      setNewImage({ src: '', title: '', category: 'Manicura' })
      setSelectedFile(null)
      setShowAddModal(false)
      setAlertMessage('¡Imagen añadida exitosamente!')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    } catch (error) {
      setAlertMessage('Error al procesar la imagen. Por favor, intenta de nuevo.')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = () => {
    if (selectedImage) {
      removeGalleryImage(selectedImage.id)
      setShowDeleteModal(false)
      setSelectedImage(null)
      setAlertMessage('¡Imagen eliminada exitosamente!')
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 3000)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Manicura': return 'primary'
      case 'Pedicura': return 'secondary'
      case 'Especial': return 'warning'
      default: return 'light'
    }
  }

  return (
    <>
      {showAlert && (
        <Alert variant="success" className="mb-4">
          {alertMessage}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4>🖼️ Gestionar Galería</h4>
          <p className="text-muted mb-0">Total de imágenes: {galleryImages.length}</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              resetGalleryToDefaults()
              setAlertMessage('¡Galería restablecida a imágenes por defecto!')
              setShowAlert(true)
              setTimeout(() => setShowAlert(false), 3000)
            }}
          >
            🔄 Restablecer
          </Button>
          <Button 
            variant="primary" 
            onClick={() => setShowAddModal(true)}
          >
            ➕ Añadir Imagen
          </Button>
        </div>
      </div>

      <Row>
        {galleryImages.length === 0 ? (
          <Col lg={12}>
            <Card className="text-center py-5">
              <Card.Body>
                <div style={{ fontSize: '4rem' }} className="mb-3">🖼️</div>
                <h5>No hay imágenes en la galería</h5>
                <p className="text-muted">Añade la primera imagen para comenzar a mostrar tu trabajo.</p>
                <Button variant="primary" onClick={() => setShowAddModal(true)}>
                  ➕ Añadir Primera Imagen
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ) : (
          galleryImages.map((image) => (
            <Col md={6} lg={4} key={image.id} className="mb-4">
              <Card className="h-100">
                <div style={{ height: '250px', overflow: 'hidden' }}>
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
                  <Card.Title className="h6">{image.title}</Card.Title>
                  <div className="d-flex justify-content-between align-items-center">
                    <Badge bg={getCategoryColor(image.category)}>
                      {image.category}
                    </Badge>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => {
                        setSelectedImage(image)
                        setShowDeleteModal(true)
                      }}
                    >
                      🗑️
                    </Button>
                  </div>
                  <small className="text-muted d-block mt-2">
                    Añadida: {image.uploadedAt.toLocaleDateString('es-PR')}
                  </small>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {/* Add Image Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nueva Imagen</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddImage}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Seleccionar Imagen</Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                required
              />
              <Form.Text className="text-muted">
                Formatos permitidos: JPG, PNG, WebP. Tamaño máximo: 5MB
              </Form.Text>
            </Form.Group>

            {selectedFile && (
              <div className="mb-3 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>Archivo seleccionado:</strong> {selectedFile.name} 
                  ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </small>
              </div>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Título de la Imagen</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Manicura Francesa Elegante"
                value={newImage.title}
                onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select 
                value={newImage.category} 
                onChange={(e) => setNewImage({...newImage, category: e.target.value as 'Manicura' | 'Pedicura' | 'Especial'})}
              >
                <option value="Manicura">Manicura</option>
                <option value="Pedicura">Pedicura</option>
                <option value="Especial">Especial</option>
              </Form.Select>
            </Form.Group>

            {newImage.src && (
              <div className="text-center">
                <p className="mb-2">Vista previa:</p>
                <img 
                  src={newImage.src} 
                  alt="Vista previa"
                  style={{ maxWidth: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowAddModal(false)
                setNewImage({ src: '', title: '', category: 'Manicura' })
                setSelectedFile(null)
              }}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Subiendo...
                </>
              ) : (
                '📁 Subir Imagen'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <>
              <p>¿Estás segura de que quieres eliminar esta imagen?</p>
              <div className="text-center">
                <img 
                  src={selectedImage.src} 
                  alt={selectedImage.title}
                  style={{ maxWidth: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <p className="mt-2"><strong>{selectedImage.title}</strong></p>
              </div>
              <p className="text-danger">
                <strong>Esta acción no se puede deshacer.</strong>
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteImage}>
            🗑️ Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AdminGallery