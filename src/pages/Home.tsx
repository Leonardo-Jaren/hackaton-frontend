import { useAuthStore } from '../store/useAuthStore'
import { Button } from '../components/ui/Button'

export default function Home() {
  const { logout, user } = useAuthStore()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">¡Bienvenido, {user?.username || 'Usuario'}!</h1>
        <p className="mb-6 text-gray-600">Has iniciado sesión correctamente.</p>
        <Button onClick={logout} variant="danger">
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
