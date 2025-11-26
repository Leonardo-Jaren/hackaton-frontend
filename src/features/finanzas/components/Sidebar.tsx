import { Home, ListTodo, Lock, BarChart3, Settings, HelpCircle, LogOut } from "lucide-react"
import { motion } from "framer-motion"
import { useAuthStore } from "../../../store/useAuthStore"

interface SidebarProps {
  currentPage: string
  setCurrentPage: (page: string) => void
}

export function Sidebar({ currentPage, setCurrentPage }: SidebarProps) {
  const { logout, user } = useAuthStore()
  const navItems = [
    { id: "dashboard", label: "Inicio", icon: Home },
    { id: "transactions", label: "Registro de Transacciones", icon: ListTodo },
    { id: "closure", label: "Cierre de Caja", icon: Lock },
    { id: "reports", label: "Reportes", icon: BarChart3 },
    { id: "settings", label: "Configuración", icon: Settings },
    { id: "help", label: "Ayuda", icon: HelpCircle },
  ]

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <motion.div 
            className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center"
            whileHover={{ rotate: 10, scale: 1.1 }}
          >
            <Lock className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="font-bold text-slate-100 text-sm">Caja</h1>
            <p className="text-xs text-slate-400">Inteligente</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          return (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </motion.button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-slate-400 overflow-hidden">
            <p className="font-medium text-slate-200 truncate">{user?.username || 'Usuario'}</p>
            <p className="truncate">{user?.email || 'empresa@example.com'}</p>
          </div>
          <motion.button 
            onClick={logout}
            className="p-2 text-slate-300 hover:bg-slate-800 hover:text-white rounded-md transition-colors"
            title="Cerrar Sesión"
            whileHover={{ scale: 1.1, color: "#ef4444" }}
            whileTap={{ scale: 0.9 }}
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </aside>
  )
}
