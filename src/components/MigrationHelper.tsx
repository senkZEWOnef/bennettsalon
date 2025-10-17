import React, { useState, useEffect } from 'react'
import { Modal, Button, Alert, Spinner } from 'react-bootstrap'
import { DataMigration } from '../utils/migration'

interface MigrationHelperProps {
  onMigrationComplete: () => void
}

export const MigrationHelper: React.FC<MigrationHelperProps> = ({ onMigrationComplete }) => {
  const [show, setShow] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [migrationResult, setMigrationResult] = useState<string | null>(null)

  useEffect(() => {
    // Check if we need to show migration modal
    const hasCompleted = DataMigration.hasMigrationCompleted()
    const hasLocalData = DataMigration.hasLocalStorageData()
    
    if (!hasCompleted && hasLocalData) {
      setShow(true)
    }
  }, [])

  const handleMigrate = async () => {
    setMigrating(true)
    setMigrationResult(null)
    
    try {
      await DataMigration.runMigration()
      setMigrationResult('success')
      setTimeout(() => {
        setShow(false)
        onMigrationComplete()
      }, 2000)
    } catch (error) {
      setMigrationResult(`error: ${error}`)
    } finally {
      setMigrating(false)
    }
  }

  const handleSkip = () => {
    // Mark as completed to avoid showing again
    localStorage.setItem('migrationCompleted', 'true')
    setShow(false)
    onMigrationComplete()
  }

  if (!show) return null

  return (
    <Modal show={show} backdrop="static" keyboard={false} centered>
      <Modal.Header>
        <Modal.Title>🚀 Database Migration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">
          <h5>Upgrade to Professional Database</h5>
          <p>
            We've detected existing data in your browser storage. To provide a better, 
            more reliable experience, we're upgrading to a professional database system.
          </p>
          <p><strong>Benefits:</strong></p>
          <ul>
            <li>✅ Data is securely stored in the cloud</li>
            <li>✅ Access from any device</li>
            <li>✅ Automatic backups</li>
            <li>✅ Better performance</li>
            <li>✅ Multi-user support</li>
          </ul>
        </Alert>

        {migrating && (
          <Alert variant="warning">
            <Spinner animation="border" size="sm" className="me-2" />
            Migrating your data... Please wait.
          </Alert>
        )}

        {migrationResult === 'success' && (
          <Alert variant="success">
            ✅ Migration completed successfully! Your data is now safely stored in the database.
          </Alert>
        )}

        {migrationResult && migrationResult.startsWith('error') && (
          <Alert variant="danger">
            ❌ {migrationResult}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button 
          variant="outline-secondary" 
          onClick={handleSkip}
          disabled={migrating}
        >
          Skip for Now
        </Button>
        <Button 
          variant="primary" 
          onClick={handleMigrate}
          disabled={migrating}
        >
          {migrating ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Migrating...
            </>
          ) : (
            'Migrate Data'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}