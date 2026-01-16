import { useState } from 'react'
import { Card, Form, Button, Alert } from 'react-bootstrap'
import { useAdmin } from '../../contexts/AdminContextNew'
import { ApiService } from '../../services/api'

const AdminSettings = () => {
  const { currentAdmin } = useAdmin()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'danger', text: string } | null>(null)

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'danger', text: 'Las contraseñas nuevas no coinciden' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'danger', text: 'La contraseña debe tener al menos 8 caracteres' })
      return
    }

    if (!currentAdmin?.username) {
      setMessage({ type: 'danger', text: 'No se pudo identificar el usuario actual' })
      return
    }

    setLoading(true)
    try {
      const success = await ApiService.changeAdminPassword(
        currentAdmin.username,
        currentPassword,
        newPassword
      )

      if (success) {
        setMessage({ type: 'success', text: 'Contraseña actualizada correctamente' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage({ type: 'danger', text: 'Contraseña actual incorrecta' })
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error al cambiar la contraseña' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h4 className="mb-4" style={{ color: '#2C3E50', fontWeight: '600' }}>
        <i className="fas fa-cog me-2"></i>
        Configuración
      </h4>

      <Card style={{ border: 'none', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Card.Body className="p-4">
          <h5 className="mb-3" style={{ fontWeight: '600' }}>
            <i className="fas fa-key me-2"></i>
            Cambiar Contraseña
          </h5>

          {currentAdmin && (
            <p className="text-muted mb-4">
              Usuario actual: <strong>{currentAdmin.username}</strong>
            </p>
          )}

          {message && (
            <Alert variant={message.type} onClose={() => setMessage(null)} dismissible>
              {message.text}
            </Alert>
          )}

          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Contraseña Actual</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                style={{ borderRadius: '8px' }}
              />
              <Form.Text className="text-muted">
                Mínimo 8 caracteres
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirmar Nueva Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ borderRadius: '8px' }}
              />
            </Form.Group>

            <Button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#667eea',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 24px',
                fontWeight: '500'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Actualizando...
                </>
              ) : (
                <>
                  <i className="fas fa-save me-2"></i>
                  Guardar Cambios
                </>
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminSettings
