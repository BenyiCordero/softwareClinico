export default function DashboardPage() {
  return (
    <div className="welcome-container">
      <div className="welcome-card text-center">
        <div className="welcome-icon mb-4">
          <i className="fas fa-heartbeat" />
        </div>
        <h2 className="welcome-title">Bienvenido al Sistema</h2>
        <p className="welcome-text text-muted">Selecciona un módulo en el menú lateral para comenzar</p>
      </div>
    </div>
  )
}